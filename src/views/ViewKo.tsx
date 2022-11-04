import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getKo } from '../requests';
import { Ko } from '../types';

export const ViewKo = () => {
  const { documentId } = useParams();

  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Ko>({
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
  });

  useEffect(() => {
    const request = async () => {
      setLoading(true);
      const result = await getKo(documentId);
      setValues(result.fields);
      setLoading(false);
    };

    request();
  }, [documentId]);

  const listItems = (values: Ko) => {
    return Object.entries(values).map(([key, value]) => {
      return key == 'name_jp_kanji' ? null : (
        <li key={key}>
          <em>{key}: </em> {value}
        </li>
      );
    });
  };

  return (
    <>
      <h2>{values.name_jp_kanji}</h2>
      {loading ? 'Loading ...' : <ul>{listItems(values)}</ul>}
      <p>
        <Link to={`/ko/${documentId}/edit`}>edit</Link> this Ko
      </p>
    </>
  );
};
