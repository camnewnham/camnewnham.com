import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import { rehostImages } from "./reshost-images";

export const notion = new NotionAPI();

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);
  recordMap.signed_urls = await rehostImages(recordMap.signed_urls);
  return recordMap;
}
