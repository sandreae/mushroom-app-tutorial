import React, { useEffect, useMemo } from 'react';
import { getYear } from './requests';
import { YEAR_ID } from './constants';

const LOCAL_STORAGE_KEY_YEAR = 'year';
const LOCAL_STORAGE_KEY_SEKKI = 'sekki';
const LOCAL_STORAGE_KEY_KO = 'ko';

const load = async (): Promise<void> => {
  // Check if the year's documentId stored in local storage is the one we expect
  // for this app instance.
  //
  // If it isn't set, or is not what we expect then we reset the whole cache
  // with a fresh call to the node. The cache stores documentIds for Sekki
  // and Ko documents.
  const year = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY_YEAR));
  if (year.meta.documentId == YEAR_ID) {
    return;
  }

  const result = await getYear();
  window.localStorage.setItem(LOCAL_STORAGE_KEY_YEAR, result.meta.documentId);

  const sekkiDocumentIds: string[] = [];
  const koDocumentIds: string[] = [];
  result.fields.sekki.forEach((sekki) => {
    sekkiDocumentIds.push(sekki.meta.documentId);
    koDocumentIds.push(sekki.fields.ko_01.meta.documentId);
    koDocumentIds.push(sekki.fields.ko_02.meta.documentId);
    koDocumentIds.push(sekki.fields.ko_03.meta.documentId);
  });

  window.localStorage.setItem(
    LOCAL_STORAGE_KEY_SEKKI,
    JSON.stringify(sekkiDocumentIds),
  );

  window.localStorage.setItem(
    LOCAL_STORAGE_KEY_KO,
    JSON.stringify(koDocumentIds),
  );
};

function allSekkiIds(): string[] {
  const sekkiDocumentIds = JSON.parse(
    window.localStorage.getItem(LOCAL_STORAGE_KEY_SEKKI),
  );
  if (sekkiDocumentIds) {
    return sekkiDocumentIds;
  }
}

function allKoIds(): string[] {
  const koDocumentIds = JSON.parse(
    window.localStorage.getItem(LOCAL_STORAGE_KEY_KO),
  );
  if (koDocumentIds) {
    return koDocumentIds;
  }
}

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
  const state = useMemo(() => {
    const sekkiDocumentIds = allSekkiIds();
    const koDocumentIds = allKoIds();

    return {
      sekkiDocumentIds,
      koDocumentIds,
    };
  }, []);

  useEffect(() => {
    load();
  }, []);

  return (
    <DocumentIdContext.Provider value={state}>
      {children}
    </DocumentIdContext.Provider>
  );
};
