import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getKo } from '../requests';
import { ShowKo } from '../components/ShowKo';
import { Ko } from '../types';
import { DocumentIdContext } from '../DocumentIdContext';

export const ViewKo = () => {
  const { id } = useParams();

  const { koDocumentIds } = useContext(DocumentIdContext);

  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [ko, setKo] = useState<Ko>(null);

  useEffect(() => {
    const request = async () => {
      const numId = parseInt(id);

      setLoading(true);
      const result = await getKo(koDocumentIds[numId - 1]);
      setKo(result.fields);
      setHasNext(numId < 72);
      setHasPrevious(numId > 1);
      setLoading(false);
    };

    request();
  }, [id, koDocumentIds]);

  return (
    <div className="narrow-page">
      {loading ? 'Loading ...' : <ShowKo {...ko} />}
      {hasPrevious ? <Link to={`/ko/${parseInt(id) - 1}`}>previous</Link> : ''}
      {hasNext ? <Link to={`/ko/${parseInt(id) + 1}`}>next</Link> : ''}
      <Link to={`/ko/${id}/edit`}>edit</Link>
    </div>
  );
};
