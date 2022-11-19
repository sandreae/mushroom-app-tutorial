import React, { useEffect, useMemo, useState } from 'react';
import { getYear } from './requests';
import { YEAR_ID } from './constants';

const LOCAL_STORAGE_KEY_YEAR = 'year';
const LOCAL_STORAGE_KEY_SEKKI = 'sekki';
const LOCAL_STORAGE_KEY_KO = 'ko';

type Context = {
  sekkiDocumentIds: string[] | null;
  koDocumentIds: string[] | null;
};

export const DocumentIdContext = React.createContext<Context>({
  sekkiDocumentIds: null,
  koDocumentIds: null,
});

type Props = {
  children: JSX.Element;
};

export const DocumentStoreProvider: React.FC<Props> = ({ children }) => {
  const [sekkiDocumentIds, setSekkiDocumentIds] = useState(
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY_SEKKI)),
  );
  const [koDocumentIds, setKoDocumentIds] = useState(
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY_KO)),
  );

  useEffect(() => {
    async function init() {
      // Check if the year's documentId stored in local storage is the one we expect
      // for this app instance.
      //
      // If it isn't set, or is not what we expect then we reset the whole cache
      // with a fresh call to the node. The cache stores documentIds for Sekki
      // and Ko documents.
      const year = window.localStorage.getItem(LOCAL_STORAGE_KEY_YEAR);

      if (year == YEAR_ID) {
        return;
      }

      const result = await getYear();
      window.localStorage.setItem(LOCAL_STORAGE_KEY_YEAR, YEAR_ID);

      const sekkiDocumentIds: string[] = [];
      const koDocumentIds: string[] = [];
      result.fields.sekki.forEach((sekki) => {
        sekkiDocumentIds.push(sekki.meta.documentId);
        koDocumentIds.push(sekki.fields.ko_01.meta.documentId);
        koDocumentIds.push(sekki.fields.ko_02.meta.documentId);
        koDocumentIds.push(sekki.fields.ko_03.meta.documentId);
      });

      setSekkiDocumentIds(sekkiDocumentIds);
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY_SEKKI,
        JSON.stringify(sekkiDocumentIds),
      );

      setKoDocumentIds(koDocumentIds);
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY_KO,
        JSON.stringify(koDocumentIds),
      );
    }
    init();
  }, []);

  return (
    <DocumentIdContext.Provider value={{ sekkiDocumentIds, koDocumentIds }}>
      {children}
    </DocumentIdContext.Provider>
  );
};
