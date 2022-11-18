import { GraphQLClient } from 'graphql-request';
import {
  KeyPair,
  encodeOperation,
  signAndEncodeEntry,
  OperationFields,
} from 'p2panda-js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { KO_SCHEMA_ID, SEKKI_SCHEMA_ID, YEAR_SCHEMA_ID } from './schemas.json';
import { loadKeyPair, nextArgs, RelationList, publish } from './common';
import type { Sekki, Ko } from './src/types.d';

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
  img_description_en: '',
  img_description_jp_kanji: '',
  img_description_jp_kana: '',
  img_description_jp_romaji: '',
  img_url: '',
};

const getAllSekki = (year: number) => {
  return [
    {
      id: 1,
      name_en: 'Beginning of spring',
      name_jp_kanji: '立春',
      name_jp_kana: 'りっしゅん',
      name_jp_romaji: 'Rishhun',
      ko_01: {
        ...defaultKo,
        id: 1,
        from: new Date(year, 2, 4).toISOString(),
        to: new Date(year, 2, 8).toISOString(),
        name_en: 'East wind melts the ice',
        name_jp_kanji: '東風解凍',
        name_jp_romaji: 'Harukaze kōri o toku',
      },
      ko_02: {
        ...defaultKo,
        id: 2,
        from: new Date(year, 2, 9).toISOString(),
        to: new Date(year, 2, 13).toISOString(),
        name_en: 'Bush warblers start singing in the mountains',
        name_jp_kanji: '黄鶯睍睆',
        name_jp_romaji: 'Kōō kenkan su',
      },
      ko_03: {
        ...defaultKo,
        id: 3,
        from: new Date(year, 2, 14).toISOString(),
        to: new Date(year, 2, 18).toISOString(),
        name_en: 'Fish emerge from the ice',
        name_jp_kanji: '魚上氷',
        name_jp_romaji: 'Uo kōri o izuru',
      },
    },
    {
      id: 2,
      name_en: 'Rainwater',
      name_jp_kanji: '雨水',
      name_jp_kana: 'うすい',
      name_jp_romaji: 'Usui',
      ko_01: {
        ...defaultKo,
        id: 4,
        from: new Date(year, 2, 19).toISOString(),
        to: new Date(year, 2, 23).toISOString(),
        name_en: 'Rain moistens the soil',
        name_jp_kanji: '土脉潤起',
        name_jp_romaji: 'Tsuchi no shō uruoi okoru',
      },
      ko_02: {
        ...defaultKo,
        id: 5,
        from: new Date(year, 2, 24).toISOString(),
        to: new Date(year, 2, 28).toISOString(),
        name_en: 'Mist starts to linger',
        name_jp_kanji: '霞始靆',
        name_jp_romaji: 'Kasumi hajimete tanabiku',
      },
      ko_03: {
        ...defaultKo,
        id: 6,
        from: new Date(year, 3, 1).toISOString(),
        to: new Date(year, 3, 5).toISOString(),
        name_en: 'Grass sprouts, trees bud',
        name_jp_kanji: '草木萌動 ',
        name_jp_romaji: 'Sōmoku mebae izuru',
      },
    },
    {
      id: 3,
      name_en: 'Insects awaken',
      name_jp_kanji: '啓蟄',
      name_jp_kana: 'けいちつ',
      name_jp_romaji: 'keichitsu',
      ko_01: {
        ...defaultKo,
        id: 7,
        from: new Date(year, 3, 6).toISOString(),
        to: new Date(year, 3, 10).toISOString(),
        name_en: 'Hibernating insects surface',
        name_jp_kanji: '蟄虫啓戸',
        name_jp_romaji: 'Sugomori mushito o hiraku',
      },
      ko_02: {
        ...defaultKo,
        id: 8,
        from: new Date(year, 3, 11).toISOString(),
        to: new Date(year, 3, 15).toISOString(),
        name_en: 'First peach blossoms',
        name_jp_kanji: '桃始笑',
        name_jp_romaji: 'Momo hajimete saku',
      },
      ko_03: {
        ...defaultKo,
        id: 9,
        from: new Date(year, 3, 16).toISOString(),
        to: new Date(year, 3, 20).toISOString(),
        name_en: 'Caterpillars become butterflies',
        name_jp_kanji: '菜虫化蝶 ',
        name_jp_romaji: 'Namushi chō to naru',
      },
    },
    {
      id: 4,
      name_en: 'Spring equinox',
      name_jp_kanji: '春分',
      name_jp_kana: 'しゅんぶん',
      name_jp_romaji: 'shunbun',
      ko_01: {
        ...defaultKo,
        id: 10,
        from: new Date(year, 3, 21).toISOString(),
        to: new Date(year, 3, 25).toISOString(),
        name_en: 'Sparrows start to nest',
        name_jp_kanji: '雀始巣',
        name_jp_romaji: 'Suzume hajimete sukū',
      },
      ko_02: {
        ...defaultKo,
        id: 11,
        from: new Date(year, 3, 26).toISOString(),
        to: new Date(year, 3, 30).toISOString(),
        name_en: 'First cherry blossoms',
        name_jp_kanji: '櫻始開',
        name_jp_romaji: 'Sakura hajimete saku',
      },
      ko_03: {
        ...defaultKo,
        id: 12,
        from: new Date(year, 3, 31).toISOString(),
        to: new Date(year, 4, 4).toISOString(),
        name_en: 'Distant thunder',
        name_jp_kanji: '雷乃発声',
        name_jp_romaji: 'Kaminari sunawachi koe o hassu',
      },
    },
    {
      id: 5,
      name_en: 'Pure and clear',
      name_jp_kanji: '清明',
      name_jp_kana: 'せいめい',
      name_jp_romaji: 'seimei',
      ko_01: {
        ...defaultKo,
        id: 13,
        from: new Date(year, 4, 5).toISOString(),
        to: new Date(year, 4, 9).toISOString(),
        name_en: 'Swallows return',
        name_jp_kanji: '玄鳥至',
        name_jp_romaji: 'Tsubame kitaru',
      },
      ko_02: {
        ...defaultKo,
        id: 14,
        from: new Date(year, 4, 10).toISOString(),
        to: new Date(year, 4, 14).toISOString(),
        name_en: 'Wild geese fly north',
        name_jp_kanji: '鴻雁北',
        name_jp_romaji: 'Kōgan kaeru',
      },
      ko_03: {
        ...defaultKo,
        id: 15,
        from: new Date(year, 4, 15).toISOString(),
        to: new Date(year, 4, 19).toISOString(),
        name_en: 'First rainbows',
        name_jp_kanji: '虹始見',
        name_jp_romaji: 'Niji hajimete arawaru',
      },
    },
    {
      id: 6,
      name_en: 'Grain rains',
      name_jp_kanji: '穀雨',
      name_jp_kana: 'こくう',
      name_jp_romaji: 'kokuu',
      ko_01: {
        ...defaultKo,
        id: 16,
        from: new Date(year, 4, 20).toISOString(),
        to: new Date(year, 4, 24).toISOString(),
        name_en: 'First reeds sprout',
        name_jp_kanji: '葭始生',
        name_jp_romaji: 'Ashi hajimete shōzu',
      },
      ko_02: {
        ...defaultKo,
        id: 17,
        from: new Date(year, 4, 25).toISOString(),
        to: new Date(year, 4, 29).toISOString(),
        name_en: 'Last frost, rice seedlings grow',
        name_jp_kanji: '霜止出苗',
        name_jp_romaji: 'Shimo yamite nae izuru',
      },
      ko_03: {
        ...defaultKo,
        id: 18,
        from: new Date(year, 4, 30).toISOString(),
        to: new Date(year, 5, 4).toISOString(),
        name_en: 'Peonies bloom',
        name_jp_kanji: '牡丹華',
        name_jp_romaji: 'Botan hana saku',
      },
    },
    {
      id: 7,
      name_en: 'Beginning of summer',
      name_jp_kanji: '立夏',
      name_jp_kana: 'りっか',
      name_jp_romaji: 'rikka',
      ko_01: {
        ...defaultKo,
        id: 19,
        from: new Date(year, 5, 5).toISOString(),
        to: new Date(year, 5, 9).toISOString(),
        name_en: 'Frogs start singing',
        name_jp_kanji: '蛙始鳴',
        name_jp_romaji: 'Kawazu hajimete naku',
      },
      ko_02: {
        ...defaultKo,
        id: 20,
        from: new Date(year, 5, 10).toISOString(),
        to: new Date(year, 5, 14).toISOString(),
        name_en: 'Worms surface',
        name_jp_kanji: '蚯蚓出',
        name_jp_romaji: 'Mimizu izuru',
      },
      ko_03: {
        ...defaultKo,
        id: 21,
        from: new Date(year, 5, 15).toISOString(),
        to: new Date(year, 5, 20).toISOString(),
        name_en: 'Bamboo shoots sprout',
        name_jp_kanji: '竹笋生',
        name_jp_romaji: 'Takenoko shōzu',
      },
    },
    {
      id: 8,
      name_en: 'Lesser ripening',
      name_jp_kanji: '小満',
      name_jp_kana: 'しょーまん',
      name_jp_romaji: 'shōman',
      ko_01: {
        ...defaultKo,
        id: 22,
        from: new Date(year, 5, 21).toISOString(),
        to: new Date(year, 5, 25).toISOString(),
        name_en: 'Silkworms start feasting on mulberry leaves',
        name_jp_kanji: '	蚕起食桑',
        name_jp_romaji: 'Kaiko okite kuwa o hamu',
      },
      ko_02: {
        ...defaultKo,
        id: 23,
        from: new Date(year, 5, 26).toISOString(),
        to: new Date(year, 5, 30).toISOString(),
        name_en: 'Safflowers bloom',
        name_jp_kanji: '紅花栄',
        name_jp_romaji: 'Benibana sakau',
      },
      ko_03: {
        ...defaultKo,
        id: 24,
        from: new Date(year, 5, 31).toISOString(),
        to: new Date(year, 6, 5).toISOString(),
        name_en: 'Wheat ripens and is harvested',
        name_jp_kanji: '麦秋至',
        name_jp_romaji: 'Mugi no toki itaru',
      },
    },
    {
      id: 9,
      name_en: 'Grain beards and seeds',
      name_jp_kanji: '芒種',
      name_jp_kana: 'ぼーしゅ',
      name_jp_romaji: 'bōshu',
      ko_01: {
        ...defaultKo,
        id: 25,
        from: new Date(year, 6, 6).toISOString(),
        to: new Date(year, 6, 10).toISOString(),
        name_en: 'Praying mantises hatch',
        name_jp_kanji: '蟷螂生',
        name_jp_romaji: 'Kamakiri shōzu',
      },
      ko_02: {
        ...defaultKo,
        id: 26,
        from: new Date(year, 6, 11).toISOString(),
        to: new Date(year, 6, 15).toISOString(),
        name_en: 'Rotten grass becomes fireflies',
        name_jp_kanji: '腐草為螢',
        name_jp_romaji: 'Kusaretaru kusa hotaru to naru',
      },
      ko_03: {
        ...defaultKo,
        id: 27,
        from: new Date(year, 6, 16).toISOString(),
        to: new Date(year, 6, 20).toISOString(),
        name_en: 'Plums turn yellow',
        name_jp_kanji: '梅子黄',
        name_jp_romaji: 'Ume no mi kibamu',
      },
    },
    {
      id: 10,
      name_en: 'Summer solstice',
      name_jp_kanji: '夏至',
      name_jp_kana: 'げし',
      name_jp_romaji: 'geshi',
      ko_01: {
        ...defaultKo,
        id: 28,
        from: new Date(year, 6, 21).toISOString(),
        to: new Date(year, 6, 26).toISOString(),
        name_en: 'Self-heal withers',
        name_jp_kanji: '乃東枯',
        name_jp_romaji: 'Natsukarekusa karuru',
      },
      ko_02: {
        ...defaultKo,
        id: 29,
        from: new Date(year, 6, 27).toISOString(),
        to: new Date(year, 7, 1).toISOString(),
        name_en: 'Irises bloom',
        name_jp_kanji: '菖蒲華',
        name_jp_romaji: 'Ayame hana saku',
      },
      ko_03: {
        ...defaultKo,
        id: 30,
        from: new Date(year, 7, 2).toISOString(),
        to: new Date(year, 7, 6).toISOString(),
        name_en: 'Crow-dipper sprouts',
        name_jp_kanji: '半夏生',
        name_jp_romaji: 'Hange shōzu',
      },
    },
    {
      id: 11,
      name_en: 'Lesser heat',
      name_jp_kanji: '小暑',
      name_jp_kana: 'しょーしょ',
      name_jp_romaji: 'shōsho',
      ko_01: {
        ...defaultKo,
        id: 31,
        from: new Date(year, 7, 7).toISOString(),
        to: new Date(year, 7, 11).toISOString(),
        name_en: 'Warm winds blow',
        name_jp_kanji: '温風至',
        name_jp_romaji: 'Atsukaze itaru',
      },
      ko_02: {
        ...defaultKo,
        id: 32,
        from: new Date(year, 7, 12).toISOString(),
        to: new Date(year, 7, 16).toISOString(),
        name_en: 'First lotus blossoms',
        name_jp_kanji: '蓮始開',
        name_jp_romaji: 'Hasu hajimete hiraku',
      },
      ko_03: {
        ...defaultKo,
        id: 33,
        from: new Date(year, 7, 17).toISOString(),
        to: new Date(year, 7, 22).toISOString(),
        name_en: 'Hawks learn to fly',
        name_jp_kanji: '鷹乃学習',
        name_jp_romaji: 'Taka sunawachi waza o narau',
      },
    },
    {
      id: 12,
      name_en: 'Greater heat',
      name_jp_kanji: '大暑',
      name_jp_kana: 'たいしょ',
      name_jp_romaji: 'taisho',
      ko_01: {
        ...defaultKo,
        id: 34,
        from: new Date(year, 7, 23).toISOString(),
        to: new Date(year, 7, 28).toISOString(),
        name_en: 'Paulownia trees produce seeds',
        name_jp_kanji: '桐始結花',
        name_jp_romaji: 'Kiri hajimete hana o musubu',
      },
      ko_02: {
        ...defaultKo,
        id: 35,
        from: new Date(year, 7, 29).toISOString(),
        to: new Date(year, 8, 2).toISOString(),
        name_en: 'Earth is damp, air is humid',
        name_jp_kanji: '土潤溽暑',
        name_jp_romaji: 'Tsuchi uruōte mushi atsushi',
      },
      ko_03: {
        ...defaultKo,
        id: 36,
        from: new Date(year, 8, 3).toISOString(),
        to: new Date(year, 8, 7).toISOString(),
        name_en: 'Great rains sometimes fall',
        name_jp_kanji: '大雨時行 ',
        name_jp_romaji: 'Taiu tokidoki furu',
      },
    },
    {
      id: 13,
      name_en: 'Beginning of autumn',
      name_jp_kanji: '立秋',
      name_jp_kana: 'りっしゅー',
      name_jp_romaji: 'risshū',
      ko_01: {
        ...defaultKo,
        id: 37,
        from: new Date(year, 8, 8).toISOString(),
        to: new Date(year, 8, 12).toISOString(),
        name_en: 'Cool winds blow',
        name_jp_kanji: '涼風至',
        name_jp_romaji: 'Suzukaze itaru',
      },
      ko_02: {
        ...defaultKo,
        id: 38,
        from: new Date(year, 8, 13).toISOString(),
        to: new Date(year, 8, 17).toISOString(),
        name_en: 'Evening cicadas sing',
        name_jp_kanji: '寒蝉鳴',
        name_jp_romaji: 'Higurashi naku',
      },
      ko_03: {
        ...defaultKo,
        id: 39,
        from: new Date(year, 8, 18).toISOString(),
        to: new Date(year, 8, 22).toISOString(),
        name_en: 'Thick fog descends',
        name_jp_kanji: '蒙霧升降',
        name_jp_romaji: 'Fukaki kiri matō',
      },
    },
    {
      id: 14,
      name_en: 'Manageable heat',
      name_jp_kanji: '処暑',
      name_jp_kana: 'しょしょ',
      name_jp_romaji: 'Shosho',
      ko_01: {
        ...defaultKo,
        id: 40,
        from: new Date(year, 8, 23).toISOString(),
        to: new Date(year, 8, 27).toISOString(),
        name_en: 'Cotton flowers bloom',
        name_jp_kanji: '綿柎開',
        name_jp_romaji: 'Wata no hana shibe hiraku',
      },
      ko_02: {
        ...defaultKo,
        id: 41,
        from: new Date(year, 8, 28).toISOString(),
        to: new Date(year, 9, 1).toISOString(),
        name_en: 'Heat starts to die down',
        name_jp_kanji: '天地始粛',
        name_jp_romaji: 'Tenchi hajimete samushi',
      },
      ko_03: {
        ...defaultKo,
        id: 42,
        from: new Date(year, 9, 2).toISOString(),
        to: new Date(year, 9, 7).toISOString(),
        name_en: 'Rice ripens',
        name_jp_kanji: '禾乃登',
        name_jp_romaji: 'Kokumono sunawachi minoru',
      },
    },
    {
      id: 15,
      name_en: 'White dew',
      name_jp_kanji: '白露',
      name_jp_kana: 'はくろ',
      name_jp_romaji: 'hakuro',
      ko_01: {
        ...defaultKo,
        id: 43,
        from: new Date(year, 9, 8).toISOString(),
        to: new Date(year, 9, 12).toISOString(),
        name_en: 'Dew glistens white on grass',
        name_jp_kanji: '草露白',
        name_jp_romaji: 'Kusa no tsuyu shiroshi',
      },
      ko_02: {
        ...defaultKo,
        id: 44,
        from: new Date(year, 9, 13).toISOString(),
        to: new Date(year, 9, 17).toISOString(),
        name_en: 'Wagtails sing',
        name_jp_kanji: '鶺鴒鳴',
        name_jp_romaji: 'Sekirei naku',
      },
      ko_03: {
        ...defaultKo,
        id: 45,
        from: new Date(year, 9, 18).toISOString(),
        to: new Date(year, 9, 22).toISOString(),
        name_en: 'Swallows leave',
        name_jp_kanji: '玄鳥去',
        name_jp_romaji: 'Tsubame saru',
      },
    },
    {
      id: 16,
      name_en: 'Autumn equinox',
      name_jp_kanji: '秋分',
      name_jp_kana: 'しゅーぶん',
      name_jp_romaji: 'shūbun',
      ko_01: {
        ...defaultKo,
        id: 46,
        from: new Date(year, 9, 23).toISOString(),
        to: new Date(year, 9, 27).toISOString(),
        name_en: 'Thunder ceases',
        name_jp_kanji: '雷乃収声',
        name_jp_romaji: 'Kaminari sunawachi koe o osamu',
      },
      ko_02: {
        ...defaultKo,
        id: 47,
        from: new Date(year, 9, 28).toISOString(),
        to: new Date(year, 10, 2).toISOString(),
        name_en: 'Insects hole up underground',
        name_jp_kanji: '蟄虫坏戸',
        name_jp_romaji: 'Mushi kakurete to o fusagu',
      },
      ko_03: {
        ...defaultKo,
        id: 48,
        from: new Date(year, 10, 3).toISOString(),
        to: new Date(year, 10, 7).toISOString(),
        name_en: 'Farmers drain fields',
        name_jp_kanji: '水始涸',
        name_jp_romaji: 'Mizu hajimete karuru',
      },
    },
    {
      id: 17,
      name_en: 'Cold dew',
      name_jp_kanji: '寒露',
      name_jp_kana: 'かんろ',
      name_jp_romaji: 'kanro',
      ko_01: {
        ...defaultKo,
        id: 49,
        from: new Date(year, 10, 8).toISOString(),
        to: new Date(year, 10, 12).toISOString(),
        name_en: 'Wild geese return',
        name_jp_kanji: '鴻雁来',
        name_jp_romaji: 'Kōgan kitaru',
      },
      ko_02: {
        ...defaultKo,
        id: 50,
        from: new Date(year, 10, 13).toISOString(),
        to: new Date(year, 10, 17).toISOString(),
        name_en: 'Chrysanthemums bloom',
        name_jp_kanji: '菊花開',
        name_jp_romaji: 'Kiku no hana hiraku',
      },
      ko_03: {
        ...defaultKo,
        id: 51,
        from: new Date(year, 10, 18).toISOString(),
        to: new Date(year, 10, 22).toISOString(),
        name_en: 'Crickets chirp around the door',
        name_jp_kanji: '蟋蟀在戸',
        name_jp_romaji: 'Kirigirisu to ni ari',
      },
    },
    {
      id: 18,
      name_en: 'Frost falls',
      name_jp_kanji: '霜降',
      name_jp_kana: 'そーこ',
      name_jp_romaji: 'sōkō',
      ko_01: {
        ...defaultKo,
        id: 52,
        from: new Date(year, 10, 23).toISOString(),
        to: new Date(year, 10, 27).toISOString(),
        name_en: 'First frost',
        name_jp_kanji: '霜始降',
        name_jp_romaji: 'Shimo hajimete furu',
      },
      ko_02: {
        ...defaultKo,
        id: 53,
        from: new Date(year, 10, 28).toISOString(),
        to: new Date(year, 11, 1).toISOString(),
        name_en: 'Light rains sometimes fall',
        name_jp_kanji: '霎時施',
        name_jp_romaji: 'Kosame tokidoki furu',
      },
      ko_03: {
        ...defaultKo,
        id: 54,
        from: new Date(year, 11, 2).toISOString(),
        to: new Date(year, 11, 6).toISOString(),
        name_en: 'Maple leaves and ivy turn yellow',
        name_jp_kanji: '楓蔦黄',
        name_jp_romaji: 'Momiji tsuta kibamu',
      },
    },
    {
      id: 19,
      name_en: 'Beginning of winter',
      name_jp_kanji: '立冬',
      name_jp_kana: 'りっとー',
      name_jp_romaji: 'rittō',
      ko_01: {
        ...defaultKo,
        id: 55,
        from: new Date(year, 11, 7).toISOString(),
        to: new Date(year, 11, 11).toISOString(),
        name_en: 'Camellias bloom',
        name_jp_kanji: '山茶始開',
        name_jp_romaji: 'Tsubaki hajimete hiraku',
      },
      ko_02: {
        ...defaultKo,
        id: 56,
        from: new Date(year, 11, 12).toISOString(),
        to: new Date(year, 11, 16).toISOString(),
        name_en: 'Land starts to freeze',
        name_jp_kanji: '地始凍',
        name_jp_romaji: 'Chi hajimete kōru',
      },
      ko_03: {
        ...defaultKo,
        id: 57,
        from: new Date(year, 11, 17).toISOString(),
        to: new Date(year, 11, 21).toISOString(),
        name_en: 'Daffodils bloom',
        name_jp_kanji: '金盞香',
        name_jp_romaji: 'Kinsenka saku',
      },
    },
    {
      id: 20,
      name_en: 'Lesser snow',
      name_jp_kanji: '小雪',
      name_jp_kana: 'しょーせつ',
      name_jp_romaji: 'shōsetsu',
      ko_01: {
        ...defaultKo,
        id: 58,
        from: new Date(year, 11, 22).toISOString(),
        to: new Date(year, 11, 26).toISOString(),
        name_en: 'Rainbows hide',
        name_jp_kanji: '虹蔵不見',
        name_jp_romaji: 'Niji kakurete miezu',
      },
      ko_02: {
        ...defaultKo,
        id: 59,
        from: new Date(year, 11, 27).toISOString(),
        to: new Date(year, 12, 1).toISOString(),
        name_en: 'North wind blows the leaves from the trees',
        name_jp_kanji: '朔風払葉',
        name_jp_romaji: 'Kitakaze konoha o harau',
      },
      ko_03: {
        ...defaultKo,
        id: 60,
        from: new Date(year, 12, 2).toISOString(),
        to: new Date(year, 12, 6).toISOString(),
        name_en: 'Tachibana citrus tree leaves start to turn yellow',
        name_jp_kanji: '橘始黄',
        name_jp_romaji: 'Tachibana hajimete kibamu',
      },
    },
    {
      id: 21,
      name_en: 'Greater snow',
      name_jp_kanji: '大雪',
      name_jp_kana: 'たいせす',
      name_jp_romaji: 'taisetsu',
      ko_01: {
        ...defaultKo,
        id: 61,
        from: new Date(year, 12, 7).toISOString(),
        to: new Date(year, 12, 11).toISOString(),
        name_en: 'Cold sets in, winter begins',
        name_jp_kanji: '閉塞成冬',
        name_jp_romaji: 'Sora samuku fuyu to naru',
      },
      ko_02: {
        ...defaultKo,
        id: 62,
        from: new Date(year, 12, 12).toISOString(),
        to: new Date(year, 12, 16).toISOString(),
        name_en: 'Bears start hibernating in their dens',
        name_jp_kanji: '熊蟄穴',
        name_jp_romaji: 'Kuma ana ni komoru',
      },
      ko_03: {
        ...defaultKo,
        id: 63,
        from: new Date(year, 12, 17).toISOString(),
        to: new Date(year, 12, 21).toISOString(),
        name_en: 'Salmon gather and swim upstream',
        name_jp_kanji: '鱖魚群',
        name_jp_romaji: 'Sake no uo muragaru',
      },
    },
    {
      id: 22,
      name_en: 'Winter solstice',
      name_jp_kanji: '冬至',
      name_jp_kana: 'とーじ',
      name_jp_romaji: 'tōji',
      ko_01: {
        ...defaultKo,
        id: 64,
        from: new Date(year, 12, 22).toISOString(),
        to: new Date(year, 12, 26).toISOString(),
        name_en: 'Self-heal sprouts',
        name_jp_kanji: '乃東生',
        name_jp_romaji: 'Natsukarekusa shōzu',
      },
      ko_02: {
        ...defaultKo,
        id: 65,
        from: new Date(year, 12, 27).toISOString(),
        to: new Date(year, 12, 31).toISOString(),
        name_en: 'Deer shed antlers',
        name_jp_kanji: '麋角解',
        name_jp_romaji: 'Sawashika no tsuno otsuru',
      },
      ko_03: {
        ...defaultKo,
        id: 66,
        from: new Date(year + 1, 1, 1).toISOString(),
        to: new Date(year + 1, 1, 4).toISOString(),
        name_en: 'Wheat sprouts under snow',
        name_jp_kanji: '雪下出麦',
        name_jp_romaji: 'Yuki watarite mugi nobiru',
      },
    },
    {
      id: 23,
      name_en: 'Lesser cold',
      name_jp_kanji: '小寒',
      name_jp_kana: 'しょーかん',
      name_jp_romaji: 'shōkan',
      ko_01: {
        ...defaultKo,
        id: 67,
        from: new Date(year + 1, 1, 5).toISOString(),
        to: new Date(year + 1, 1, 9).toISOString(),
        name_en: 'Parsley flourishes',
        name_jp_kanji: '芹乃栄',
        name_jp_romaji: 'Seri sunawachi sakau',
      },
      ko_02: {
        ...defaultKo,
        id: 68,
        from: new Date(year + 1, 1, 10).toISOString(),
        to: new Date(year + 1, 1, 14).toISOString(),
        name_en: 'Springs thaw',
        name_jp_kanji: '水泉動',
        name_jp_romaji: 'Shimizu atataka o fukumu',
      },
      ko_03: {
        ...defaultKo,
        id: 69,
        from: new Date(year + 1, 1, 15).toISOString(),
        to: new Date(year + 1, 1, 19).toISOString(),
        name_en: 'Pheasants start to call',
        name_jp_kanji: '雉始雊',
        name_jp_romaji: 'Kiji hajimete naku',
      },
    },
    {
      id: 24,
      name_en: 'Greater cold',
      name_jp_kanji: '大寒',
      name_jp_kana: 'だいかん',
      name_jp_romaji: 'Daikan',
      ko_01: {
        ...defaultKo,
        id: 70,
        from: new Date(year + 1, 1, 20).toISOString(),
        to: new Date(year + 1, 1, 24).toISOString(),
        name_en: 'Butterburs bud',
        name_jp_kanji: '款冬華',
        name_jp_romaji: 'Fuki no hana saku',
      },
      ko_02: {
        ...defaultKo,
        id: 71,
        from: new Date(year + 1, 1, 25).toISOString(),
        to: new Date(year + 1, 1, 29).toISOString(),
        name_en: 'Ice thickens on streams',
        name_jp_kanji: '水沢腹堅',
        name_jp_romaji: 'Sawamizu kōri tsumeru',
      },
      ko_03: {
        ...defaultKo,
        id: 72,
        from: new Date(year + 1, 1, 30).toISOString(),
        to: new Date(year + 1, 2, 3).toISOString(),
        name_en: 'Hens start laying eggs',
        name_jp_kanji: '鶏始乳',
        name_jp_romaji: 'Niwatori hajimete toya ni tsuku',
      },
    },
  ];
};

async function createYear(
  client: GraphQLClient,
  keyPair: KeyPair,
  year: number,
): Promise<string> {
  const all_sekki: RelationList = [];

  for (const sekki of getAllSekki(year)) {
    const documentId = await createSekki(client, keyPair, sekki);
    all_sekki.push(documentId);
  }

  const args = await nextArgs(client, keyPair.publicKey());

  const operationFields = new OperationFields({
    year,
    author: '',
    description: '',
  });
  operationFields.insert('sekki', 'relation_list', all_sekki);

  const operation = encodeOperation({
    schemaId: YEAR_SCHEMA_ID,
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
  console.log(`Created Year ${year} ${backlink}`);
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
  const yearId = await createYear(client, keyPair, this_year);

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
