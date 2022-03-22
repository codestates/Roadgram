import React, { useEffect } from 'react';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faXmark, faXmarkCircle, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../..';
import { removeLastTag, setTagsInfo } from '../../store/createPostSlice';

function Tag() {
  const state = useSelector((state: RootState) => state.createPost);
  const { tagsInfo } = useSelector((state: RootState) => state.createPost);
  const { tags } = useSelector((state: RootState) => state.articleDetails.articleInfo);
  const [letters, setLetters] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  const removeTags = (indexToRemove: number) => {
    dispatch(setTagsInfo(tagsInfo.filter((a, index) => index !== indexToRemove)));
  };

  const changeLetters = (e: any) => {
    // 띄어쓰기는 미포함
    const chr = e.target.value;
    if(!chr.includes(" ")) {
      setLetters(e.target.value);
    }
  }
  const addTags = (event: any) => {
    const { value } = event.target;
    if(value === "") return;
        // ESLint 수정 후 작업 필요
    console.log(value);
    console.log(value.length);
    if(value.length > 8) {
      toast.error("태그는 최대 8글자까지 작성 가능합니다.");
      return;
    }
    if(tagsInfo.length >= 5) {
      toast.error("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }

    let isTagExist = false;
    tagsInfo.forEach((tag) => {
      if(tag.tagName === value) {
        isTagExist = true;
      }
    })

    if(isTagExist) {
      toast.error("이미 등록된 태그입니다.");
      return;
    }

    if(tagsInfo.length === 0) {
      const newObj = { order: 1, tagName: value };
      console.log("들어갈 태그 정보!!", newObj);
      dispatch(setTagsInfo([newObj]));
    } else {
      const newObj = { order: tagsInfo.length + 1, tagName: value };
      console.log("들어갈 태그 정보!!", newObj);
      dispatch(setTagsInfo([...tagsInfo, newObj]));
      
    }
    setLetters("");
  }

  // const deleteOneTag = (event: any) => {
  //   if(event.target.value === "" && tagsInfo.length > 0) {
  //     dispatch(removeLastTag());
  //   }
  // }

  return (
      <div className="tag_input">
        <ul className="tags">
          {tagsInfo && true 
          ? tagsInfo.map((tag, index) => (
            <li key={tag.tagName} className="tag">
              <span className="tag-title">{`#${tag.tagName || tag}`}</span>
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
          value={letters}
          onChange={event => changeLetters(event)}
          onKeyUp={(event) => {
              if (event.key === "Enter") addTags(event);
          }}
          placeholder={!tagsInfo || tagsInfo.length === 0 ? "태그를 입력해주세요 (최대 8글자, 5개까지 등록 가능합니다.)" : ""}
        />
      </div>
      ); 
}


export default Tag