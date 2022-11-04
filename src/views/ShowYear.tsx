import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getYear } from '../requests';
import { YearResponse } from '../types';

export const ShowYear = () => {
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

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <>
          <h2>{result.fields.year}</h2>
          <ul className="feed">
            {result.fields.sekki.map(({ fields, meta }) => {
              return (
                <ul key={meta.documentId}>
                  <li>
                    <Link to={`/sekki/${meta.documentId}`}>
                      {fields.name_jp_kanji} <em>{fields.name_en}</em>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/ko/${fields.ko_01.meta.documentId}/edit`}>
                      {fields.ko_01.fields.name_jp_kanji}{' '}
                      <em>{fields.ko_01.fields.name_en}</em>
                    </Link>
                    <Link to={`/ko/${fields.ko_02.meta.documentId}/edit`}>
                      {fields.ko_02.fields.name_jp_kanji}{' '}
                      <em>{fields.ko_02.fields.name_en}</em>
                    </Link>
                    <Link to={`/ko/${fields.ko_02.meta.documentId}/edit`}>
                      {fields.ko_03.fields.name_jp_kanji}{' '}
                      <em>{fields.ko_03.fields.name_en}</em>
                    </Link>
                  </li>
                </ul>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};
