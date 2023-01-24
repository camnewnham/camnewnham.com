import * as React from "react";
import Head from "next/head";

import { ExtendedRecordMap } from "notion-types";
import { getPageBreadcrumbs, getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";

import { PageHeader } from "./PageHeader";

import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import Link from "next/link";
import Image from "next/image";

export const NotionPage = ({
  recordMap,
  rootPageId,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
}) => {
  if (!recordMap) {
    return null;
  }

  const title = getPageTitle(recordMap);
  console.log(title, recordMap);

  return (
    <>
      <Head>
        <title>{title} </title>
      </Head>

      <PageHeader />

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootPageId={rootPageId}
        components={{
          Code,
          Collection,
          Image,
          Link,
        }}
      />
    </>
  );
};
