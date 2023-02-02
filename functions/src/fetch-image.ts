// Image resizing based on https://github.com/firebase/extensions/blob/master/storage-resize-images/functions/src/resize-image.ts

import { https } from "firebase-functions";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";

export const IMAGES_PATH = "/images/";

type NextImageRequest = {
  src: string;
  w: string;
  q: string;
};

const bucket = getStorage().bucket();

export const fetchImage = https.onRequest(async (req, res): Promise<any> => {
  const query = req.query as any as NextImageRequest;

  if (!query.src || !query.w || !query.q) {
    console.error("Invalid arguments in request query");
    res.status(400).send("Invalid request");
  }

  const width = parseFloat(query.w);
  const quality = parseFloat(query.q);

  const imgUrl = new URL(query.src);

  const strippedImgUrl = imgUrl.origin + imgUrl.pathname;

  const fileName = `${encodeURIComponent(strippedImgUrl)}`;

  const extension = /(?<=\/)([^\/]+)(\.\w+$)/gm.exec(strippedImgUrl);

  if (!extension) {
    console.error("Unable to discern file type from URL");
    return res.status(400).send("Error processing image");
  }

  const destinationFileName = fileName.replace(
    extension[2],
    `@${width}q${quality}${extension[2]}`
  );

  const storagePath = IMAGES_PATH + destinationFileName;

  var storageFile = bucket.file(storagePath);
  if ((await storageFile.exists())[0]) {
    return res.redirect(storageFile.publicUrl());
  }

  const img = new Uint8Array(
    await (await fetch(imgUrl.toString())).arrayBuffer()
  );

  const tmp = path.join(os.tmpdir(), destinationFileName);

  await sharp(img, { failOnError: false, animated: true })
    .rotate()
    .resize(width, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFile(tmp);

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

  return res.redirect(storageFile.publicUrl());
});
