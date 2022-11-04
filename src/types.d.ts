// Make importing .css files in TypeScript code work
declare module '*.css';

export type Year = {
  year: number;
  sekki: Sekki[];
};

export type SekkiFields = {
  id: number;
  name_en: string;
  name_jp_kanji: string;
  name_jp_kana: string;
  name_jp_romaji: string;
};

export type Sekki = SekkiFields & {
  ko_01: Ko;
  ko_02: Ko;
  ko_03: Ko;
}

export type Ko = {
  id: number;
  from: string;
  to: string;
  name_en: string;
  name_jp_kanji: string;
  name_jp_kana: string;
  name_jp_romaji: string;
  description_en: string;
  description_jp_kanji: string;
  description_jp_kana: string;
  description_jp_romaji: string;
  image: string;
};

export type Mushroom = {
  title: string;
  description: string;
  latin: string;
  edible: boolean;
};

export type Picture = {
  blob: string;
  lat: number;
  lon: number;
  mushrooms: string[];
};

export type NextArgs = {
  logId: string;
  seqNum: string;
  backlink?: string;
  skiplink?: string;
};

export type Meta = {
  viewId: string;
  documentId: string;
};

export type YearResponse = {
  meta: Meta;
  fields: {
    year: number;
    sekki: SekkiResponse[];
  };
};

export type SekkiResponse = {
  meta: Meta;
  fields: SekkiFields & {
    ko_01: KoResponse;
    ko_02: KoResponse;
    ko_03: KoResponse;
  };
};

export type KoResponse = {
  meta: Meta;
  fields: Ko;
};
