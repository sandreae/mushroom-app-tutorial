import React from 'react';
import { Ko } from '../types';

export const ShowKo: React.FC<Ko> = ({
  image,
  name_en,
  name_jp_kanji,
  description_en,
  description_jp_kanji,
}) => {
  return (
    <ul>
      <li>
        <h2>
          {name_jp_kanji} {name_en}
        </h2>
        <img src={image} alt="" style={{ width: '100%' }} />
        <p>{description_jp_kanji}</p>
        <p>{description_en}</p>
      </li>
    </ul>
  );
};
