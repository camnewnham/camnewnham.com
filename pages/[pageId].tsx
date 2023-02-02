import * as React from "react";

import { ExtendedRecordMap } from "notion-types";
import { GetStaticProps, GetStaticPaths } from "next";

import * as notion from "../lib/notion";
import { NotionPage } from "../components/NotionPage";
import { isDev, rootNotionPageId } from "../lib/config";
import { defaultMapPageUrl } from "react-notion-x";
import { getAllPagesInSpace } from "notion-utils";

const GENERATE_STATIC_PATHS = false;

export const getStaticProps: GetStaticProps = async (context) => {
  const pageId = (context?.params?.pageId ?? rootNotionPageId) as string;
  const recordMap = await notion.getPage(pageId);

  return {
    props: {
      recordMap,
      id: pageId,
    },
    revalidate: 600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (GENERATE_STATIC_PATHS && !isDev) {
    const mapPageUrl = defaultMapPageUrl(rootNotionPageId);
    const pages = await getAllPagesInSpace(
      rootNotionPageId,
      undefined,
      notion.getPage,
      {
        traverseCollections: false,
        concurrency: 1,
      }
    );

    const paths = Object.keys(pages)
      .map((pageId) => mapPageUrl(pageId))
      .filter((path) => path && path !== "/");

    return {
      paths,
      fallback: true,
    };
  } else {
    return {
      paths: [],
      fallback: true,
    };
  }
};

export default function Page({
  recordMap,
  id,
}: {
  recordMap: ExtendedRecordMap;
  id: string;
}) {
  return <NotionPage recordMap={recordMap} id={id} />;
}
