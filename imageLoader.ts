import { isDev } from "./lib/config";

const resizeFunction = isDev
  ? "http://localhost:5001/notionhomepage/us-central1/fetchImage"
  : "https://us-central1-notionhomepage.cloudfunctions.net/fetchImage";

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `${resizeFunction}/?src=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
}
