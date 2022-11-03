import fs from 'fs';

import { GraphQLClient, gql } from 'graphql-request';
import { KeyPair } from 'p2panda-js';

export function loadKeyPair(path: string) {
  if (!path) {
    return new KeyPair();
  }

  try {
    const privateKey = fs.readFileSync(path, 'utf8').replace('\n', '');
    return new KeyPair(privateKey);
  } catch (error) {
    throw new Error(`Could not load private key from ${path}`);
  }
}

export type PinnedRelationList = string[][];
export type RelationList = string[];

type NextArgs = {
  logId: string;
  seqNum: string;
  backlink?: string;
  skiplink?: string;
};

export async function nextArgs(
  client: GraphQLClient,
  publicKey: string,
  viewId?: string,
): Promise<NextArgs> {
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

  const result = await client.request(query, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}

export async function publish(
  client: GraphQLClient,
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

  const result = await client.request(query, {
    entry,
    operation,
  });

  return result.publish;
}
