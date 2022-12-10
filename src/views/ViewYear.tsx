import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getYear } from '../requests';
import { Ko, KoResponse, SekkiFields, YearResponse } from '../types';

export const ViewYear = () => {
  const { documentId } = useParams();

  const [loading, setLoading] = useState(true);
  const [result, setValues] = useState<YearResponse>({
    meta: null,
    fields: null,
  });

  useEffect(() => {
    const request = async () => {
      setLoading(true);
      const result = await getYear();
      setValues(result);
      setLoading(false);
    };

    request();
  }, [documentId]);

  const sekkiLink = (sekki: SekkiFields, allKo: KoResponse[]) => {
    const isComplete =
      allKo.filter((ko) => {
        return (
          ko.fields.img_url != '' &&
          ko.fields.img_description_en != '' &&
          ko.fields.img_description_jp_kanji != '' &&
          ko.fields.img_description_jp_kana != '' &&
          ko.fields.img_description_jp_romaji != ''
        );
      }).length == 3;
    return isComplete ? (
      <Link to={`/sekki/${sekki.id}`}>
        {sekki.name_jp_kanji} {sekki.name_en}
      </Link>
    ) : (
      <>
        {sekki.name_jp_kanji} {sekki.name_en}
      </>
    );
  };

  const koLink = (ko: Ko) => {
    const hasTexts =
      ko.img_description_en != '' &&
      ko.img_description_jp_kanji != '' &&
      ko.img_description_jp_kana != '' &&
      ko.img_description_jp_romaji != '';

    const hasImage = ko.img_url != '';

    const date = new Date(ko.from).toLocaleDateString('en-gb', {
      day: 'numeric',
      month: 'short',
    });

    return !hasTexts || !hasImage ? (
      <li key={ko.id}>
        {date} {ko.name_jp_kanji} {ko.name_en}{' '}
        <Link to={`/ko/${ko.id}/edit`}>{hasImage ? '🖉' : '+'}</Link>
        {hasImage ? <Link to={`/ko/${ko.id}`}>👁</Link> : ''}
      </li>
    ) : (
      <li key={ko.id}>
        {`${date} `}
        <Link to={`/ko/${ko.id}`}>
          {ko.name_jp_kanji} {ko.name_en}
        </Link>
      </li>
    );
  };

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <div className="narrow-page">
          <h2>{result.fields.year}</h2>
          <ul className="feed">
            {result.fields.sekki.map(({ fields, meta }) => {
              const ko = [fields.ko_01, fields.ko_02, fields.ko_03];

              return (
                <div key={fields.id}>
                  <h2>{sekkiLink(fields, ko)}</h2>
                  <ul key={meta.documentId}>
                    {ko.map((ko) => {
                      return koLink(ko.fields);
                    })}
                  </ul>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};
