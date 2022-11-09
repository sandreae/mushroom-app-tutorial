import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getSekki } from '../requests';
import { ShowKo } from '../components/ShowKo';
import { SekkiResponse } from '../types';
import { DocumentIdContext } from '../DocumentIdContext';

export const ViewSekki = () => {
  const { id } = useParams();

  const { sekkiDocumentIds } = useContext(DocumentIdContext);

  const [loading, setLoading] = useState(true);
  const [sekki, setSekki] = useState<SekkiResponse>(null);

  useEffect(() => {
    const request = async () => {
      const numId = parseInt(id);

      setLoading(true);
      const result = await getSekki(sekkiDocumentIds[numId - 1]);
      setSekki(result);
      setLoading(false);
    };

    request();
  }, [id, sekkiDocumentIds]);

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <div className="sekki">
          <ShowKo {...sekki.fields.ko_01.fields} />
          <ShowKo {...sekki.fields.ko_02.fields} />
          <ShowKo {...sekki.fields.ko_03.fields} />
        </div>
      )}
    </>
  );
};
