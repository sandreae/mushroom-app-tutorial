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
    img_description_en: '',
    img_description_jp_kanji: '',
    img_description_jp_kana: '',
    img_description_jp_romaji: '',
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
    navigate(`/ko/${values.id}`);
  };

  return (
    <div className="narrow-page">
      <h2>Edit Ko {values['id']}</h2>
      {loading ? (
        'Loading ...'
      ) : (
        <form onSubmit={onSubmit}>
          <fieldset>
            <label>Ko name EN</label>
            <input
              type="text"
              id="name_en"
              name="name_en"
              value={values['name_en']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Ko name JP kanji</label>
            <input
              type="text"
              id="name_jp_kanji"
              name="name_jp_kanji"
              value={values['name_jp_kanji']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Ko name JP romaji</label>
            <input
              type="text"
              id="name_jp_romaji"
              name="name_jp_romaji"
              value={values['name_jp_romaji']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Ko name JP kana</label>
            <input
              type="text"
              id="name_jp_kana"
              name="name_jp_kana"
              value={values['name_jp_kana']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Image URL</label>
            <input
              type="text"
              id="img_url"
              name="img_url"
              value={values['img_url']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Image description EN</label>
            <input
              type="text"
              id="img_description_en"
              name="img_description_en"
              value={values['img_description_en']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Image description JP kanji</label>
            <input
              type="text"
              id="img_description_jp_kanji"
              name="img_description_jp_kanji"
              value={values['img_description_jp_kanji']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Image description JP romaji</label>
            <input
              type="text"
              id="img_description_jp_romaji"
              name="img_description_jp_romaji"
              value={values['img_description_jp_romaji']}
              onChange={onChange}
            />
          </fieldset>
          <fieldset>
            <label>Image description JP kana</label>
            <input
              type="text"
              id="img_description_jp_kana"
              name="img_description_jp_kana"
              value={values['img_description_jp_kana']}
              onChange={onChange}
            />
          </fieldset>
          <input type="submit" value="Update" />
        </form>
      )}
    </div>
  );
};
