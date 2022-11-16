import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentIdContext } from '../DocumentIdContext';

import { KeyPairContext } from '../KeyPairContext';
import { getKo, updateKo } from '../requests';
import { Ko } from '../types';

export const EditKo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { keyPair } = useContext(KeyPairContext);
  const { koDocumentIds } = useContext(DocumentIdContext);

  const [loading, setLoading] = useState(true);
  const [viewId, setViewId] = useState<string>();
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
    img_url: '',
  });

  useEffect(() => {
    const request = async () => {
      setLoading(true);
      const result = await getKo(koDocumentIds[(id as unknown as number) - 1]);
      setValues(result.fields);
      setViewId(result.meta.viewId);
      setLoading(false);
    };

    request();
  }, [id, koDocumentIds]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setValues((oldValues) => {
      return {
        ...oldValues,
        [name]: value,
      };
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateKo(keyPair, viewId, values);
    window.alert('Updated ko!');
    navigate('/');
  };

  const formFields = (values: Ko) => {
    return Object.entries(values).map(([key, value]) => {
      return (
        <fieldset key={key}>
          <label htmlFor={key}>{key}</label>
          <input
            type="text"
            id={key}
            name={key}
            value={value}
            onChange={onChange}
          />
        </fieldset>
      );
    });
  };

  return (
    <div className="narrow-page">
      <h2>Edit Ko</h2>
      {loading ? (
        'Loading ...'
      ) : (
        <form onSubmit={onSubmit}>
          {formFields(values)}
          <input type="submit" value="Update" />
        </form>
      )}
    </div>
  );
};
