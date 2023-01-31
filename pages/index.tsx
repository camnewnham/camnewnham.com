import * as React from "react";

import { ExtendedRecordMap } from "notion-types";
import { GetStaticProps } from "next";

import * as notion from "../lib/notion";
import { NotionPage } from "../components/NotionPage";
import { rootNotionPageId } from "../lib/config";

export const getStaticProps: GetStaticProps = async () => {
  const recordMap = await notion.getPage(rootNotionPageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 600,
  };
};

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} />;
}
