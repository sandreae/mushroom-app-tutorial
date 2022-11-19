import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header>
      <h1>
        <Link to="/">72 Seasons</Link>
      </h1>
    </header>
  );
};
