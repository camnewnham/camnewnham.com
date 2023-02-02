// Image resizing based on https://github.com/firebase/extensions/blob/master/storage-resize-images/functions/src/resize-image.ts

import { runWith } from "firebase-functions";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import sharp from "sharp";
import path from "path";
import os from "os";
import fs from "fs";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";
import lqip from "lqip-modern";
import { NextImageRequest, ImageData } from "./types";

export const IMAGES_PATH = "images";

const bucket = getStorage().bucket();
const db = getFirestore();

export const fetchImage = runWith({
  memory: "4GB",
  timeoutSeconds: 300,
}).https.onRequest(async (req, res): Promise<any> => {
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

  const storagePath = IMAGES_PATH + "/" + destinationFileName;

  var storageFile = bucket.file(storagePath);
  if ((await storageFile.exists())[0]) {
    // We have it already.
    return res.redirect(301, storageFile.publicUrl());
  } else {
    // while we process the image, send the redirect. They can have the full image first...
    console.info("Processing image: " + imgUrl);
    res.redirect(302, query.src);

    const img = new Uint8Array(
      await (await fetch(imgUrl.toString())).arrayBuffer()
    );

    const tmp = path.join(os.tmpdir(), destinationFileName);

    const buffer = await sharp(img, { failOnError: false, animated: true })
      .rotate()
      .resize(width, null, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    fs.writeFileSync(tmp, buffer);

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

    // Generate lqip preview
    await db.runTransaction(async (transaction) => {
      // firestore paths can't contain double slashes!
      const b64FileName = Buffer.from(strippedImgUrl).toString("base64");

      const docRef = db.collection("images").doc(b64FileName);
      const doc = await transaction.get(docRef);
      if (doc.exists) {
        const data = doc.data() as ImageData;
        if (data.lqip) {
          return;
        }
      }

      // Generate a lqip image and save it in the database
      const { metadata } = await lqip(buffer, {});
      const image: Partial<ImageData> = {
        lqip: metadata,
      };
      await transaction.set(docRef, image, { merge: true });
    });
  }
});
