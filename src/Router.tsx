import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ShowYear } from './views';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowYear />} />
    </Routes>
  );
};
