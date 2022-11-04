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
              const ko = [fields.ko_01, fields.ko_02, fields.ko_03];

              return (
                <>
                  <h2>
                    {fields.name_jp_kanji} {fields.name_en}
                  </h2>
                  <ul key={meta.documentId}>
                    {ko.map((ko) => {
                      return (
                        <li key={ko.fields.id}>
                          <Link to={`/ko/${ko.meta.documentId}`}>
                            {ko.fields.name_jp_kanji}{' '}
                            <em>{ko.fields.name_en}</em>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};
