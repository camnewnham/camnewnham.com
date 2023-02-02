import * as React from "react";
import Head from "next/head";

import { ExtendedRecordMap } from "notion-types";
import { getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";

import { PageHeader } from "./PageHeader";

import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { imageLoader } from "../lib/imageLoader";

const ImageOverride = (props: any) => {
  const { width, height, fill, layout, objectFit, style, alt, ...other } =
    props;

  return (
    <Image
      width={688}
      height={688}
      fill={false}
      alt={alt ?? ""}
      sizes="(min-width: 688px) 688px, 100vw"
      loader={imageLoader}
      style={{
        ...style,
        position: "relative",
      }}
      {...other}
    />
  );
};

export const NotionPage = ({
  recordMap,
  id,
}: {
  recordMap: ExtendedRecordMap;
  id?: string;
}) => {
  const title = recordMap && getPageTitle(recordMap);

  useEffect(() => {
    if (!id || !title) return;
    window.history.pushState("", "", `/${id}#${title.replaceAll(" ", "_")}`);
  }, [title, id]);

  if (!recordMap) return null;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageHeader />

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        previewImages={true}
        forceCustomImages={true} // See https://github.com/NotionX/react-notion-x/blob/16d1870029d898a9189ab6c6ddc143b795f1a592/packages/react-notion-x/src/components/lazy-image.tsx#L144-L152
        isImageZoomable={false}
        components={{
          Code,
          Collection,
          nextImage: ImageOverride,
          nextLink: Link,
        }}
      />
    </>
  );
};
