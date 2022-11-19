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
        return ko.fields.img_url == '';
      }).length == 0;
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
    const date = new Date(ko.from).toLocaleDateString('en-gb', {
      day: 'numeric',
      month: 'short',
    });
    return ko.img_url == '' ? (
      <li key={ko.id}>
        {date} {ko.name_jp_kanji} {ko.name_en}{' '}
        <Link to={`/ko/${ko.id}/edit`}>➕</Link>
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
