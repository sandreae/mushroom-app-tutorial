import React from 'react';
import { Ko } from '../types';

export const ShowKo: React.FC<Ko> = ({
  to,
  from,
  img_url,
  name_en,
  name_jp_kanji,
  img_description_en,
  img_description_jp_kanji,
  img_description_jp_kana,
  img_description_jp_romaji,
}) => {
  const from_date = new Date(from).toLocaleDateString('en-gb', {
    day: 'numeric',
    month: 'short',
  });
  const to_date = new Date(to).toLocaleDateString('en-gb', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="ko">
      <h2>
        {name_jp_kanji} {name_en}
      </h2>
      <div className="ko-img">
        <img src={img_url} alt="" />
      </div>
      <div className="ko-text">
        <ul>
          <li>
            {img_description_jp_kanji} {img_description_en}
          </li>
          <li>{img_description_jp_kana}</li>
          <li>{img_description_jp_romaji}</li>
          <li>
            {from_date} - {to_date}
          </li>
        </ul>
      </div>
    </div>
  );
};
