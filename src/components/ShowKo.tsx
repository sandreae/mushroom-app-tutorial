import React from 'react';
import { Ko } from '../types';

export const ShowKo: React.FC<Ko> = ({
  img_url,
  name_en,
  name_jp_kanji,
  img_description_en,
  img_description_jp_kanji,
}) => {
  return (
    <div className="ko">
      <div>
        <h2>
          {name_jp_kanji} {name_en}
        </h2>
        <img src={img_url} alt="" style={{ width: '100%' }} />
      </div>
      <div>
        <ul>
          <li>{img_description_en}</li>
          <li>{img_description_jp_kanji}</li>
        </ul>
      </div>
    </div>
  );
};
