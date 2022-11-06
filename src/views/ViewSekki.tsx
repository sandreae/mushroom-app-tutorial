import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getKo, getSekki } from '../requests';
import { ShowKo } from '../components/ShowKo';
import { Ko, Sekki, SekkiResponse } from '../types';
import { DocumentIdContext } from '../DocumentIdContext';

export const ViewSekki = () => {
  const { id } = useParams();

  const { sekkiDocumentIds } = useContext(DocumentIdContext);

  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [sekki, setSekki] = useState<SekkiResponse>(null);

  useEffect(() => {
    const request = async () => {
      const numId = parseInt(id);

      setLoading(true);
      const result = await getSekki(sekkiDocumentIds[numId - 1]);
      setSekki(result);
      setHasNext(numId < 12);
      setHasPrevious(numId > 1);
      setLoading(false);
    };

    request();
  }, [id, sekkiDocumentIds]);

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <>
          <ShowKo {...sekki.fields.ko_01.fields} />
          <ShowKo {...sekki.fields.ko_02.fields} />
          <ShowKo {...sekki.fields.ko_03.fields} />
        </>
      )}
      <p>
        <Link to={`/sekki/${id}/edit`}>edit</Link> this Ko
      </p>
      <p>
        {hasPrevious ? (
          <Link to={`/sekki/${parseInt(id) - 1}`}>previous</Link>
        ) : (
          ''
        )}
        {hasNext ? <Link to={`/sekki/${parseInt(id) + 1}`}>next</Link> : ''}
      </p>
    </>
  );
};
