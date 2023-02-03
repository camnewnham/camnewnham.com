import { getStorage } from "firebase-admin/storage";
import { getFirebase } from "./firebase";
import path from "path";
import os from "os";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { defaultMapImageUrl } from "react-notion-x";
import { Block } from "notion-types";
import pMap from "p-map";

const storage = getStorage(getFirebase());
const bucket = storage.bucket();
const IMAGES_PATH = "images";

export const mapImageUrl = (url: string, block: Block) => {
  if (/https?:\/\/(storage.googleapis.com)|(127.0.0.1:9199)\//.test(url)) {
    return url;
  }
  return defaultMapImageUrl(url, block) as string;
};

/**
 * Rehosts AWS-hosted images on firebase storage and makes them public.
 */
export const rehostImages = async (signed_urls: Record<string, string>) => {
  const result: Record<string, string> = {};
  await pMap(
    Object.keys(signed_urls),
    async (k) => {
      result[k] = await rehostImage(signed_urls[k]);
    },
    { concurrency: 8 }
  );
  return result;
};

const rehostImage: (oldUrl: string) => Promise<string> = async (
  oldUrl: string
) => {
  const imgUrl = new URL(oldUrl);
  const strippedImgUrl = imgUrl.origin + imgUrl.pathname;
  const extension = /(?<=\/)([^\/]+)(\.\w+$)/gm.exec(strippedImgUrl);
  const docName = Buffer.from(strippedImgUrl).toString("base64") + extension;
  const storagePath = IMAGES_PATH + "/" + docName;
  const storageFile = bucket.file(storagePath);

  if (!(await storageFile.exists())[0]) {
    const tmp = path.join(os.tmpdir(), docName);
    const img = new Uint8Array(
      await (await fetch(imgUrl.toString())).arrayBuffer()
    );
    fs.writeFileSync(tmp, img);
    await bucket.upload(tmp, {
      destination: storageFile,
      metadata: {
        cacheControl: "max-age=86400",
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        },
      },
    });
    await storageFile.makePublic();
  }

  return storageFile.publicUrl();
};
