import * as React from 'react'

import { ExtendedRecordMap } from 'notion-types'

import notion from '../lib/notion'
import { NotionPage } from '../components/NotionPage'
import { rootNotionPageId } from '../lib/config'

export const getStaticProps = async (context: { params: { pageId: string } }) => {
    const pageId = (context.params.pageId as string) || rootNotionPageId
    const recordMap = await notion.getPage(pageId)

    return {
        props: {
            recordMap
        },
        revalidate: 10
    }
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true
    }
}

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
    return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />
}