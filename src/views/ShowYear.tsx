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
            <ul>
              {result.fields.sekki.map(({ fields, meta }) => {
                return (
                  <li key={meta.documentId}>
                    <Link to={`/sekki/${meta.documentId}`}>
                      {fields.name_jp_kanji} <em>{fields.name_en}</em>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ul>
        </>
      )}
    </>
  );
};
