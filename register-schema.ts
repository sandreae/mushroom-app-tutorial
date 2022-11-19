import yargs from 'yargs';
import { GraphQLClient } from 'graphql-request';
import {
  KeyPair,
  OperationFields,
  encodeOperation,
  signAndEncodeEntry,
} from 'p2panda-js';
import { hideBin } from 'yargs/helpers';
import { loadKeyPair, nextArgs, PinnedRelationList, publish } from './common';

// This fixes getting an ECONNREFUSED when making a request against localhost
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

type Field = {
  name: string;
  type: string;
};

const YEAR_FIELDS: Field[] = [
  {
    name: 'year',
    type: 'int',
  },
  {
    name: 'author',
    type: 'str',
  },
  {
    name: 'description',
    type: 'str',
  },
  {
    name: 'sekki',
    type: 'relation_list(sekki)',
  },
];

const SEKKI_FIELDS: Field[] = [
  {
    name: 'id',
    type: 'int',
  },
  {
    name: 'name_en',
    type: 'str',
  },
  {
    name: 'name_jp_kanji',
    type: 'str',
  },
  {
    name: 'name_jp_kana',
    type: 'str',
  },
  {
    name: 'name_jp_romaji',
    type: 'str',
  },
  {
    name: 'ko_01',
    type: 'relation(ko)',
  },
  {
    name: 'ko_02',
    type: 'relation(ko)',
  },
  {
    name: 'ko_03',
    type: 'relation(ko)',
  },
];

const KO_FIELDS: Field[] = [
  {
    name: 'id',
    type: 'int',
  },
  {
    name: 'from',
    type: 'str',
  },
  {
    name: 'to',
    type: 'str',
  },
  {
    name: 'name_en',
    type: 'str',
  },
  {
    name: 'name_jp_kanji',
    type: 'str',
  },
  {
    name: 'name_jp_kana',
    type: 'str',
  },
  {
    name: 'name_jp_romaji',
    type: 'str',
  },
  {
    name: 'img_description_en',
    type: 'str',
  },
  {
    name: 'img_description_jp_kanji',
    type: 'str',
  },
  {
    name: 'img_description_jp_kana',
    type: 'str',
  },
  {
    name: 'img_description_jp_romaji',
    type: 'str',
  },
  {
    name: 'img_url',
    type: 'str',
  },
];

async function createFields(
  client: GraphQLClient,
  keyPair: KeyPair,
  fields: Field[],
): Promise<PinnedRelationList> {
  const results: PinnedRelationList = [];

  for (const field of fields) {
    const args = await nextArgs(client, keyPair.publicKey());

    const operation = encodeOperation({
      action: 'create',
      schemaId: 'schema_field_definition_v1',
      fields: {
        ...field,
      },
    });

    const entry = signAndEncodeEntry(
      {
        ...args,
        operation,
      },
      keyPair,
    );

    const { backlink } = await publish(client, entry, operation);
    console.log(`Created schema field ${backlink}`);
    results.push([backlink]);
  }

  return results;
}

async function createSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
  name: string,
  description: string,
  fields: PinnedRelationList,
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey());

  const operationFields = new OperationFields({
    name,
    description,
  });
  operationFields.insert('fields', 'pinned_relation_list', fields);

  const operation = encodeOperation({
    action: 'create',
    schemaId: 'schema_definition_v1',
    fields: operationFields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      operation,
    },
    keyPair,
  );

  const { backlink } = await publish(client, entry, operation);
  console.log(`Created schema ${name}_${backlink}`);
  return `${name}_${backlink}`;
}

async function createYearSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
  sekkiSchemaId: string,
): Promise<string> {
  const name = 'seventy_two_seasons_year';
  const description = 'One year of the ancient Japanese seasonal calendar';
  const fields_parsed: Field[] = YEAR_FIELDS.map((item) => {
    if (item.type == 'relation_list(sekki)') {
      item.type = `relation_list(${sekkiSchemaId})`;
    }
    return item;
  });
  const fields = await createFields(client, keyPair, fields_parsed);
  return await createSchema(client, keyPair, name, description, fields);
}

async function createSekkiSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
  koSchemaId: string,
): Promise<string> {
  const name = 'seventy_two_seasons_sekki';
  const description =
    'One of the 24 major divisions in the ancient Japanese seasonal calendar';

  const fields_parsed: Field[] = SEKKI_FIELDS.map((item) => {
    if (item.type == 'relation(ko)') {
      item.type = `relation(${koSchemaId})`;
    }
    return item;
  });

  const fields = await createFields(client, keyPair, fields_parsed);
  return await createSchema(client, keyPair, name, description, fields);
}

async function createKoSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
): Promise<string> {
  const name = 'seventy_two_seasons_ko';
  const description =
    'One of the 72 minor divisions in the ancient Japanese seasonal calendar';

  const fields = await createFields(client, keyPair, KO_FIELDS);
  return await createSchema(client, keyPair, name, description, fields);
}

async function run(keyPair: KeyPair, endpoint: string) {
  console.log('Create and deploy schemas for the mushroom tutorial app');

  const client = new GraphQLClient(endpoint);

  const koSchemaId = await createKoSchema(client, keyPair);
  const sekkiSchemaId = await createSekkiSchema(client, keyPair, koSchemaId);
  const yearSchemaId = await createYearSchema(client, keyPair, sekkiSchemaId);

  console.log();

  console.log('Next step: Add these lines to your `./config.json` file:');

  console.log(`"KO_SCHEMA_ID": "${koSchemaId}",`);
  console.log(`"SEKKI_SCHEMA_ID": "${sekkiSchemaId}",`);
  console.log(`"YEAR_SCHEMA_ID": "${yearSchemaId}"`);
}

const { argv } = yargs(hideBin(process.argv))
  .usage('Usage: --privateKey [path] --endpoint [url]')
  .option('privateKey', {
    alias: 'k',
    describe: 'Path to file holding private key',
    type: 'string',
  })
  .option('endpoint', {
    alias: 'e',
    describe: 'Endpoint of p2panda node',
    type: 'string',
    default: 'http://localhost:2020/graphql',
  });

type Args = {
  privateKey: string | undefined;
  endpoint: string;
};

const { privateKey, endpoint } = argv as unknown as Args;
const keyPair = loadKeyPair(privateKey);

run(keyPair, endpoint);
