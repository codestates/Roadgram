import React, { useEffect } from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faXmark, faXmarkCircle, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../..';
import { setTagsInfo } from '../../store/createPostSlice';

function Tag() {
  const state = useSelector((state: RootState) => state.createPost);
  const { tagsInfo } = useSelector((state: RootState) => state.createPost);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(state);
    console.log(tagsInfo);
  },)
  const removeTags = (indexToRemove: number) => {
    // setTempTags([...tags.slice(0, indexToRemove), ...tags.slice(indexToRemove + 1, tags.length)]);
    dispatch(setTagsInfo(tagsInfo.filter((a, index) => index !== indexToRemove)));
  };

  const addTags = (event: any) => {
    const { value } = event.target;
    if(value === "") return;
    if(tagsInfo.length >= 5) {
      alert("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }

    const hashTag = `#${value}`;
    // ESLint 수정 후 작업 필요
    // tagsInfo.forEach((tag) => {
    //   if(tag.tagName === hashTag) return;
    // })

    if(tagsInfo.length === 0) {
      const newObj = { order: 1, tagName: hashTag };
      dispatch(setTagsInfo([newObj]));
    } else {
      const newObj = { order: tagsInfo.length + 1, tagName: hashTag };
      dispatch(setTagsInfo([...tagsInfo, newObj]));
    }
    event.target.value = "";
  }

  return (
      <div className="tag_input">
        <ul className="tags">
          {tagsInfo && true 
          ? tagsInfo.map((tag, index) => (
            <li key={tag.tagName} className="tag">
              <span className="tag-title">{tag.tagName}</span>
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
          ))
        : null}
        </ul>
        <input
          className="tag-input"
          type="text"
          onKeyUp={(event) => {
              if (event.key === "Enter") addTags(event);
          }}
          placeholder={!tagsInfo ? "태그를 입력해주세요 (최대 5개까지 등록 가능)" : ""}
        />
      </div>
  );
}


export default Tag