import { GraphQLClient, gql, RequestDocument } from 'graphql-request';

import { ENDPOINT, YEAR_SCHEMA_ID, YEAR_ID, KO_SCHEMA_ID } from './constants';

import type { KoResponse, NextArgs, YearResponse } from './types.d';

const client = new GraphQLClient(ENDPOINT);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request(query: RequestDocument, variables?: any) {
  try {
    return await client.request(query, variables);
  } catch (error) {
    console.error(error);

    window.alert(
      'Error: Could not connect to node.\n\n- Did you start the node at port `2020`?\n- Did you deploy the schemas (via `npm run schema`) and changed the schema ids in `./src/constants.ts`?',
    );
  }
}

const meta_query_fields = `
  meta {
    documentId
    viewId
  }
`;

const ko_query_fields = `
  fields {
    id
    from
    to
    name_en
    name_jp_kanji
    name_jp_kana
    name_jp_romaji
    description_en
    description_jp_kanji
    description_jp_kana
    description_jp_romaji
    image
  }
`;

const sekki_query_fields = `
  fields {
    id
    name_en
    name_jp_kanji
    name_jp_kana
    name_jp_romaji
    ko_01 {
      ${meta_query_fields}
      ${ko_query_fields}
    }
    ko_02 {
      ${meta_query_fields}
      ${ko_query_fields}
    }
    ko_03 {
      ${meta_query_fields}
      ${ko_query_fields}
    }
  }
`;

async function nextArgs(publicKey: string, viewId?: string): Promise<NextArgs> {
  const query = gql`
    query NextArgs($publicKey: String!, $viewId: String) {
      nextArgs(publicKey: $publicKey, viewId: $viewId) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await request(query, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

export async function publish(
  entry: string,
  operation: string,
): Promise<NextArgs> {
  const query = gql`
    mutation Publish($entry: String!, $operation: String!) {
      publish(entry: $entry, operation: $operation) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await request(query, {
    entry,
    operation,
  });

  return result.publish;
}

export async function getYear(): Promise<YearResponse> {
  const query = gql`{
    year: ${YEAR_SCHEMA_ID}(id: "${YEAR_ID}") {
      ${meta_query_fields}
      fields {
        year
        sekki {
          ${meta_query_fields}
          ${sekki_query_fields}
        }
      }
    }
  }`;

  const result = await request(query);
  return result.year;
}

export async function getKo(documentId: string): Promise<KoResponse> {
  const query = gql`{
    ko: ${KO_SCHEMA_ID}(id: "${documentId}") {
      ${meta_query_fields}
      ${ko_query_fields}
    }
  }`;

  const result = await request(query);
  return result.ko;
}
