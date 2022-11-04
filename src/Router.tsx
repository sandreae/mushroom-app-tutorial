import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ShowYear, EditKo } from './views';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowYear />} />
      <Route path="/ko/:documentId/edit" element={<EditKo />} />
    </Routes>
  );
};
