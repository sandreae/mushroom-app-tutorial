import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';

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

  const download = (dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `sekki-${id}.png`;
    a.click();
  };

  const downloadScreenshot = () =>
    toPng(document.getElementById('sekki'), {
      backgroundColor: 'white',
      canvasWidth: 1754,
      canvasHeight: 1240,
    }).then(function (dataUrl) {
      download(dataUrl);
    });

  return (
    <>
      {loading ? (
        'Loading ...'
      ) : (
        <>
          <div id="sekki">
            <h1 className="sekki-name-jp">{sekki.fields.name_jp_kanji}</h1>
            <h1 className="sekki-name-en">{sekki.fields.name_en}</h1>
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
