import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ShowYear, EditKo, ViewKo } from './views';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="ko/:id/edit" element={<EditKo />} />
      <Route path="ko/:id" element={<ViewKo />} />
      <Route path="/" element={<ShowYear />} />
    </Routes>
  );
};
