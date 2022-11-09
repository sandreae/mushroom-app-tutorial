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
    <div className="ko">
      <div>
        <h2>
          {name_jp_kanji} {name_en}
        </h2>
        <img src={image} alt="" style={{ width: '100%' }} />
      </div>
      <div>
        <ul>
          <li>{description_en}</li>
          <li>{description_jp_kanji}</li>
        </ul>
      </div>
    </div>
  );
};
