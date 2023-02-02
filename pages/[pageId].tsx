import * as React from "react";

import { ExtendedRecordMap } from "notion-types";
import { GetStaticProps, GetStaticPaths } from "next";

import * as notion from "../lib/notion";
import { NotionPage } from "../components/NotionPage";
import { rootNotionPageId } from "../lib/config";

export const getStaticProps: GetStaticProps = async (context) => {
  const pageId = (context?.params?.pageId ?? rootNotionPageId) as string;
  const recordMap = await notion.getPage(pageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} />;
}
