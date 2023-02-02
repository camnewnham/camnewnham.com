import { ImageLoader } from "next/image";
import { isDev } from "./config";

const resizeFunction = isDev
  ? "http://localhost:5001/notionhomepage/us-central1/fetchImage"
  : "https://us-central1-notionhomepage.cloudfunctions.net/fetchImage";

export const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${resizeFunction}/?src=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
};
