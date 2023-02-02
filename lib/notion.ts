import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import { getPreviewImageMap } from "./preview-images";

export const notion = new NotionAPI();

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);
  const previewImageMap = await getPreviewImageMap(recordMap);
  (recordMap as any).preview_images = previewImageMap;
  return recordMap;
}
