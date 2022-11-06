import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getYear } from '../requests';
import { Ko, YearResponse } from '../types';

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

  const koLink = (ko: Ko) => {
    return ko.image == '' ? (
      <li key={ko.id}>
        {ko.name_jp_kanji} {ko.name_en}
        <Link to={`/ko/${ko.id}/edit`}>➕</Link>
      </li>
    ) : (
      <li key={ko.id}>
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
        <>
          <h2>{result.fields.year}</h2>
          <ul className="feed">
            {result.fields.sekki.map(({ fields, meta }) => {
              const ko = [fields.ko_01, fields.ko_02, fields.ko_03];

              return (
                <div key={fields.id}>
                  <h2>
                    <Link to={`/sekki/${fields.id}`}>
                      {fields.name_jp_kanji} {fields.name_en}
                    </Link>
                  </h2>
                  <ul key={meta.documentId}>
                    {ko.map((ko) => {
                      return koLink(ko.fields);
                    })}
                  </ul>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};
