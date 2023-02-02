import { getFirestore } from "firebase-admin/firestore";
import { ExtendedRecordMap, PreviewImageMap, PreviewImage } from "notion-types";
import { getPageImageUrls } from "notion-utils";
import pMap from "p-map";
import { defaultMapImageUrl } from "react-notion-x";
import { getFirebase } from "./firebase";

const getPreviewImage: (url: string) => Promise<PreviewImage | null> = async (
  url: string
) => {
  const imgUrl = new URL(url);
  const strippedImgUrl = imgUrl.origin + imgUrl.pathname;
  const b64 = Buffer.from(strippedImgUrl).toString("base64");

  const doc = await getFirestore(getFirebase())
    .collection("images")
    .doc(b64)
    .get();
  if (doc.exists) {
    const data = doc.data() as any;
    if (data.lqip) {
      return data.lqip as PreviewImage;
    }
  }
  return null;
};

export async function getPreviewImageMap(
  recordMap: ExtendedRecordMap
): Promise<PreviewImageMap> {
  const urls: string[] = getPageImageUrls(recordMap, {
    mapImageUrl: defaultMapImageUrl,
  });

  const previewImagesMap = Object.fromEntries(
    await pMap(urls, async (url) => [url, await getPreviewImage(url)], {
      concurrency: 8,
    })
  );

  return previewImagesMap;
}
