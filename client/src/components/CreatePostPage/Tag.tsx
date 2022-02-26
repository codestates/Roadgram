import React from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faXmark, faXmarkCircle, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
// TODO: Styled-Component 라이브러리를 활용해 여러분만의 tag 를 자유롭게 꾸며 보세요!

function Tag() {
  const initialTags = ["부산", "해운대", "광안리"];

  const [tags, setTags] = useState(initialTags);

  const removeTags = (indexToRemove: number) => {
    // setTags([...tags.slice(0, indexToRemove), ...tags.slice(indexToRemove + 1, tags.length)]);
    setTags(tags.filter((a, index) => index !== indexToRemove));
  };

  const addTags = (event: any) => {
    const {value} = event.target;
    if(value === "") return;
    if(tags.length >= 5) {
      alert("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }

    const hashTag = `#${value}`;
    if (!tags.includes(hashTag)) {
      setTags([...tags, hashTag]);
      event.target.value = "";
    }
  }

  return (
      <div className="tag_input">
        <ul className="tags">
          {tags.map((tag, index) => (
            <li key={tag} className="tag">
              <span className="tag-title">{tag}</span>
              <FontAwesomeIcon
                icon={faXmark}
                // tabIndex={index}
                // role="button"
                className="tag-close-icon"
                onClick={() => {removeTags(index);}}
                // onKeyDown={() => {
                //   removeTags(index);
                // }}
              />
            </li>
          ))}
        </ul>
        <input
          className="tag-input"
          type="text"
          onKeyUp={(event) => {
              if (event.key === "Enter") addTags(event);
          }}
          placeholder={tags.length === 0 ? "태그를 입력해주세요 (최대 5개까지 등록 가능)" : ""}
        />
      </div>
  );
}


export default Tag