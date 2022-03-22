import React, { useEffect } from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../..';
import { removeLastTag, setTagsInfo } from '../../store/createPostSlice';

function Tag() {
  const state = useSelector((state: RootState) => state.createPost);
  const { tagsInfo } = useSelector((state: RootState) => state.createPost);
  const { tags } = useSelector((state: RootState) => state.articleDetails.articleInfo);
  const [letters, setLetters] = useState("");
  const [removeMode, setRemoveMode] = useState(false);
  const dispatch = useDispatch();

  const removeTags = (indexToRemove: number) => {
    const organized = tagsInfo
    .filter((_, index) => index !== indexToRemove)
    .map((b, idx) => {
        return { order: idx + 1,tagName: b.tagName}
    })
    dispatch(setTagsInfo(organized));
  };

  const changeLetters = async (e: any) => {
    const { value } = e.target;

    // 띄어쓰기는 미포함
    if(!value.includes(" ")){
      setLetters(value);
      setRemoveMode(false);
    }
    
    // 삭제해서 빈 값이 들어올 경우 1초 후 removeMode true로 변경해준다.
    if(value === "") {
      await setTimeout(() => {
        setRemoveMode(true);
      }, 1000); 
    } 
  }
  const addTags = (event: any) => {
    const { value } = event.target;
    if(value === "") return;
    if(value.length > 8) {
      alert("태그는 최대 8글자까지 작성 가능합니다.");
      return;
    }
    if(tagsInfo.length >= 5) {
      alert("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }

    let isTagExist = false;
    tagsInfo.forEach((tag) => {
      if(tag.tagName === value) {
        isTagExist = true;
      }
    })

    if(isTagExist) {
      alert("이미 등록된 태그입니다.");
      return;
    }

    if(tagsInfo.length === 0) {
      const newObj = { order: 1, tagName: value };
      dispatch(setTagsInfo([newObj]));
    } else {
      const newObj = { order: tagsInfo.length + 1, tagName: value };
      dispatch(setTagsInfo([...tagsInfo, newObj]));
      
    }
    setLetters("");
    setRemoveMode(true);
  }

  const deleteOneTag = () => {
      if(letters === "" && removeMode && tagsInfo.length > 0) {
        dispatch(removeLastTag());
      }
    
  }

  return (
      <div className="tag_input">
        <ul className="tags">
          {tagsInfo && true 
          ? tagsInfo.map((tag, index) => (
            <li key={tag.tagName} className="tag">
              <span className="tag-title">{`#${tag.tagName || tag}`}</span>
              <FontAwesomeIcon
                icon={faXmark}
                className="tag-close-icon"
                onClick={() => {removeTags(index);}}
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
              if (event.key === "Backspace") deleteOneTag();
          }}
          placeholder={!tagsInfo || tagsInfo.length === 0 ? "게시물과 관련된 태그를 입력해주세요 (최대 8글자, 5개까지 등록 가능합니다.)" : ""}
        />
      </div>
      ); 
}


export default Tag