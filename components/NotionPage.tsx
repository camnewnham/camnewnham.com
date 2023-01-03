import * as React from 'react'
import Head from 'next/head'

import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

import { PageHeader } from './PageHeader'

import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from 'react-notion-x/build/third-party/collection';

export const NotionPage = ({
    recordMap,
    rootPageId
}: {
    recordMap: ExtendedRecordMap
    rootPageId?: string
}) => {
    if (!recordMap) {
        return null
    }

    const title = getPageTitle(recordMap);
    console.log(title, recordMap);

    return (
        <>
            <Head>
                <meta name='description' content='React Notion X Minimal Demo' />
                <title>{title} </title>
            </Head>

            <PageHeader />

            < NotionRenderer
                recordMap={recordMap}
                fullPage={true}
                darkMode={false}
                rootPageId={rootPageId}
                components={{
                    Code,
                    Collection
                }}
            />
        </>
    );
}