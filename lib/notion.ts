import { NotionAPI } from "notion-client";
import { ExtendedRecordMap, SearchParams, SearchResults } from "notion-types";

export const notion = new NotionAPI();

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);
  return recordMap;
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params);
}
