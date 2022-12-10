import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

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

  const download = (canvas) => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `sekki-${id}.png`;
    a.click();
  };

  const downloadScreenshot = () =>
    html2canvas(document.querySelector('#sekki'), { useCORS: true }).then(
      (canvas) => {
        download(canvas);
      },
    );

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <>
          <div id="sekki">
            <h1>{sekki.fields.name_jp_kanji}</h1>
            <h1>{sekki.fields.name_en}</h1>
            <div id="ko-list">
              <ShowKo {...sekki.fields.ko_01.fields} />
              <ShowKo {...sekki.fields.ko_02.fields} />
              <ShowKo {...sekki.fields.ko_03.fields} />
            </div>
          </div>
          <button onClick={downloadScreenshot}>download</button>
        </>
      )}
    </>
  );
};
