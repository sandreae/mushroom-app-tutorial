import { GraphQLClient } from 'graphql-request';
import { KeyPair, encodeOperation, signAndEncodeEntry } from 'p2panda-js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { KO_SCHEMA_ID, SEKKI_SCHEMA_ID, YEAR_SCHEMA_ID } from './schemas.json';
import { loadKeyPair, nextArgs, publish } from './common';
import type { Year, Sekki, Ko } from './src/types.d';

// This fixes getting an ECONNREFUSED when making a request against localhost
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

const defaultKo: Ko = {
  id: 1,
  from: '',
  to: '',
  name_en: '',
  name_jp_kanji: '',
  name_jp_kana: '',
  name_jp_romaji: '',
  description_en: '',
  description_jp_kanji: '',
  description_jp_kana: '',
  description_jp_romaji: '',
  image: '',
};

const ALL_SEKKI: Sekki[] = [
  {
    id: 1,
    name_en: 'Beginning of spring',
    name_jp_kanji: '立春',
    name_jp_kana: 'りっしゅん',
    name_jp_romaji: 'Rishhun',
    ko_01: { ...defaultKo, id: 1 },
    ko_02: { ...defaultKo, id: 2 },
    ko_03: { ...defaultKo, id: 3 },
  },
  {
    id: 2,
    name_en: 'Rainwater',
    name_jp_kanji: '雨水',
    name_jp_kana: 'うすい',
    name_jp_romaji: 'Usui',
    ko_01: { ...defaultKo, id: 4 },
    ko_02: { ...defaultKo, id: 5 },
    ko_03: { ...defaultKo, id: 6 },
  },
  {
    id: 3,
    name_en: 'Insects awaken',
    name_jp_kanji: '啓蟄',
    name_jp_kana: 'けいちつ',
    name_jp_romaji: 'keichitsu',
    ko_01: { ...defaultKo, id: 7 },
    ko_02: { ...defaultKo, id: 8 },
    ko_03: { ...defaultKo, id: 9 },
  },
  {
    id: 4,
    name_en: 'Spring equinox',
    name_jp_kanji: '春分',
    name_jp_kana: 'しゅんぶん',
    name_jp_romaji: 'shunbun',
    ko_01: { ...defaultKo, id: 10 },
    ko_02: { ...defaultKo, id: 11 },
    ko_03: { ...defaultKo, id: 12 },
  },
  {
    id: 5,
    name_en: 'Pure and clear',
    name_jp_kanji: '清明',
    name_jp_kana: 'せいめい',
    name_jp_romaji: 'seimei',
    ko_01: { ...defaultKo, id: 13 },
    ko_02: { ...defaultKo, id: 14 },
    ko_03: { ...defaultKo, id: 15 },
  },
  {
    id: 6,
    name_en: 'Grain rains',
    name_jp_kanji: '穀雨',
    name_jp_kana: 'こくう',
    name_jp_romaji: 'kokuu',
    ko_01: { ...defaultKo, id: 16 },
    ko_02: { ...defaultKo, id: 17 },
    ko_03: { ...defaultKo, id: 18 },
  },
  {
    id: 7,
    name_en: 'Beginning of summer',
    name_jp_kanji: '立夏',
    name_jp_kana: 'りっか',
    name_jp_romaji: 'rikka',
    ko_01: { ...defaultKo, id: 19 },
    ko_02: { ...defaultKo, id: 20 },
    ko_03: { ...defaultKo, id: 21 },
  },
  {
    id: 8,
    name_en: 'Lesser ripening',
    name_jp_kanji: '小満',
    name_jp_kana: 'しょーまん',
    name_jp_romaji: 'shōman',
    ko_01: { ...defaultKo, id: 22 },
    ko_02: { ...defaultKo, id: 23 },
    ko_03: { ...defaultKo, id: 24 },
  },
  {
    id: 9,
    name_en: 'Grain beards and seeds',
    name_jp_kanji: '芒種',
    name_jp_kana: 'ぼーしゅ',
    name_jp_romaji: 'bōshu',
    ko_01: { ...defaultKo, id: 25 },
    ko_02: { ...defaultKo, id: 26 },
    ko_03: { ...defaultKo, id: 27 },
  },
  {
    id: 10,
    name_en: 'Summer solstice',
    name_jp_kanji: '夏至',
    name_jp_kana: 'げし',
    name_jp_romaji: 'geshi',
    ko_01: { ...defaultKo, id: 28 },
    ko_02: { ...defaultKo, id: 29 },
    ko_03: { ...defaultKo, id: 30 },
  },
  {
    id: 11,
    name_en: 'Lesser heat',
    name_jp_kanji: '小暑',
    name_jp_kana: 'しょーしょ',
    name_jp_romaji: 'shōsho',
    ko_01: { ...defaultKo, id: 31 },
    ko_02: { ...defaultKo, id: 32 },
    ko_03: { ...defaultKo, id: 33 },
  },
  {
    id: 12,
    name_en: 'Greater heat',
    name_jp_kanji: '大暑',
    name_jp_kana: 'たいしょ',
    name_jp_romaji: 'taisho',
    ko_01: { ...defaultKo, id: 34 },
    ko_02: { ...defaultKo, id: 35 },
    ko_03: { ...defaultKo, id: 36 },
  },
  {
    id: 13,
    name_en: 'Beginning of autumn',
    name_jp_kanji: '立秋',
    name_jp_kana: 'りっしゅー',
    name_jp_romaji: 'risshū',
    ko_01: { ...defaultKo, id: 37 },
    ko_02: { ...defaultKo, id: 38 },
    ko_03: { ...defaultKo, id: 39 },
  },
  {
    id: 14,
    name_en: 'Manageable heat',
    name_jp_kanji: '処暑',
    name_jp_kana: 'しょしょ',
    name_jp_romaji: 'Shosho',
    ko_01: { ...defaultKo, id: 40 },
    ko_02: { ...defaultKo, id: 41 },
    ko_03: { ...defaultKo, id: 42 },
  },
  {
    id: 15,
    name_en: 'White dew',
    name_jp_kanji: '白露',
    name_jp_kana: 'はくろ',
    name_jp_romaji: 'hakuro',
    ko_01: { ...defaultKo, id: 43 },
    ko_02: { ...defaultKo, id: 44 },
    ko_03: { ...defaultKo, id: 45 },
  },
  {
    id: 16,
    name_en: 'Autumn equinox',
    name_jp_kanji: '秋分',
    name_jp_kana: 'しゅーぶん',
    name_jp_romaji: 'shūbun',
    ko_01: { ...defaultKo, id: 46 },
    ko_02: { ...defaultKo, id: 47 },
    ko_03: { ...defaultKo, id: 48 },
  },
  {
    id: 17,
    name_en: 'Cold dew',
    name_jp_kanji: '寒露',
    name_jp_kana: 'かんろ',
    name_jp_romaji: 'kanro',
    ko_01: { ...defaultKo, id: 49 },
    ko_02: { ...defaultKo, id: 50 },
    ko_03: { ...defaultKo, id: 51 },
  },
  {
    id: 18,
    name_en: 'Frost falls',
    name_jp_kanji: '霜降',
    name_jp_kana: 'そーこ',
    name_jp_romaji: 'sōkō',
    ko_01: { ...defaultKo, id: 52 },
    ko_02: { ...defaultKo, id: 53 },
    ko_03: { ...defaultKo, id: 54 },
  },
  {
    id: 19,
    name_en: 'Beginning of winter',
    name_jp_kanji: '立冬',
    name_jp_kana: 'りっとー',
    name_jp_romaji: 'rittō',
    ko_01: { ...defaultKo, id: 55 },
    ko_02: { ...defaultKo, id: 56 },
    ko_03: { ...defaultKo, id: 57 },
  },
  {
    id: 20,
    name_en: 'Lesser snow',
    name_jp_kanji: '小雪',
    name_jp_kana: 'しょーせつ',
    name_jp_romaji: 'shōsetsu',
    ko_01: { ...defaultKo, id: 58 },
    ko_02: { ...defaultKo, id: 59 },
    ko_03: { ...defaultKo, id: 60 },
  },
  {
    id: 21,
    name_en: 'Greater snow',
    name_jp_kanji: '大雪',
    name_jp_kana: 'たいせす',
    name_jp_romaji: 'taisetsu',
    ko_01: { ...defaultKo, id: 61 },
    ko_02: { ...defaultKo, id: 62 },
    ko_03: { ...defaultKo, id: 63 },
  },
  {
    id: 22,
    name_en: 'Winter solstice',
    name_jp_kanji: '冬至',
    name_jp_kana: 'とーじ',
    name_jp_romaji: 'tōji',
    ko_01: { ...defaultKo, id: 64 },
    ko_02: { ...defaultKo, id: 65 },
    ko_03: { ...defaultKo, id: 66 },
  },
  {
    id: 23,
    name_en: 'Lesser cold',
    name_jp_kanji: '小寒',
    name_jp_kana: 'しょーかん',
    name_jp_romaji: 'shōkan',
    ko_01: { ...defaultKo, id: 67 },
    ko_02: { ...defaultKo, id: 68 },
    ko_03: { ...defaultKo, id: 69 },
  },
  {
    id: 24,
    name_en: 'Greater cold',
    name_jp_kanji: '大寒',
    name_jp_kana: 'だいかん',
    name_jp_romaji: 'Daikan',
    ko_01: { ...defaultKo, id: 71 },
    ko_02: { ...defaultKo, id: 72 },
    ko_03: { ...defaultKo, id: 73 },
  },
];

async function createYear(
  client: GraphQLClient,
  keyPair: KeyPair,
  year: Year,
): Promise<string> {
  const all_sekki = {};
  for await (const sekki of ALL_SEKKI) {
    const documentId = await createSekki(client, keyPair, sekki);
    const key = sekki.id < 10 ? 'sekki_0' + sekki.id : 'sekki_' + sekki.id;
    all_sekki[key] = documentId;
  }

  const args = await nextArgs(client, keyPair.publicKey());
  const operation = encodeOperation({
    schemaId: YEAR_SCHEMA_ID,
    fields: {
      ...year,
      ...all_sekki,
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
  console.log(`Created Year ${year.year} ${backlink}`);
  return backlink;
}

async function createSekki(
  client: GraphQLClient,
  keyPair: KeyPair,
  sekki: Sekki,
): Promise<string> {
  const ko_01 = await createKo(client, keyPair, sekki.ko_01);
  const ko_02 = await createKo(client, keyPair, sekki.ko_02);
  const ko_03 = await createKo(client, keyPair, sekki.ko_03);

  const args = await nextArgs(client, keyPair.publicKey());
  const operation = encodeOperation({
    schemaId: SEKKI_SCHEMA_ID,
    fields: {
      ...sekki,
      ko_01,
      ko_02,
      ko_03,
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
  console.log(`Created Sekki ${sekki.id} ${backlink}`);
  return backlink;
}

async function createKo(
  client: GraphQLClient,
  keyPair: KeyPair,
  ko: Ko,
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey());
  const operation = encodeOperation({
    schemaId: KO_SCHEMA_ID,
    fields: {
      ...ko,
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
  console.log(`Created Ko ${ko.id} ${backlink}`);
  return backlink;
}

async function run(keyPair: KeyPair, endpoint: string) {
  console.log('Create and deploy schemas for the mushroom tutorial app');

  const client = new GraphQLClient(endpoint);

  const this_year = new Date().getFullYear();

  const year: Year = { year: this_year };
  const yearId = await createYear(client, keyPair, year);

  console.log();
  console.log('Next step: Create a file `./year.json` and paste this into it:');
  console.log('{');
  console.log(`  "YEAR_ID": "${yearId}"`);
  console.log('}');
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
