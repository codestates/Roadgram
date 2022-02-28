import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '..';
import Tag from '../components/CreatePostPage/Tag';
import TextArea from '../components/CreatePostPage/TextArea';
import Upload from '../components/CreatePostPage/Upload';

function CreatePostPage() {
  const postInfo = useSelector((state: RootState) => state.createPost);
  const {userInfo, accessToken} = useSelector((state: RootState) => state.auth)
  const {content, images, tagsInfo, thumbnail} = postInfo;

  useEffect(() => {
    console.log("post 입력 정보 ==", postInfo);
  }, [postInfo]);

  const posting = () => {
    console.log("posting 시작!");
    if(content === "") {
      alert("본문은 필수 입력 정보입니다..");
      return;
    } 
    axios
    .post(`${process.env.REACT_APP_API_URL}/articles`,
    {
      user: userInfo.id,
      content,
      road: images,
      tag: tagsInfo,
      thumbnail,
      loginMethod: userInfo.loginMethod
    },
    {
      headers:
      {
        authorization: `${accessToken}`
      }
    })
    .then((res) => console.log(res.data))
    .catch(console.log);

    let isImageNull = true
    images.forEach((image) => {
      if(image.imgSrc === "")
        isImageNull = false
    })

    if(!isImageNull) alert(`모든 경로의 이미지를 업로드 해 주시기 바랍니다.`);
  }


  return (
  <div className='createpost_whole_div'>
    <div className="createpost_title_div">
      <div className="arrow_icon_div">
        <Link to="/settingroute">
        <FontAwesomeIcon icon={faArrowLeft} className="arrow_icon"/>
        </Link>
      </div>
      <h1>게시글 작성</h1>
    </div>
    <section className='createpost_tag_section'>
      <span className='createpost_tag_title'>* 태그</span>
      <Tag/>
    </section>
    <section className='createpost_content_section'>
      <span className='createpost_content_title'>* 본문</span>
      <TextArea/>
    </section>
    <section className='createpost_upload_section'>
      <span className='createpost_upload_title'>* 이미지 업로드</span>
      <Upload/>
    </section>
      <button className='createpost_submit_button'type="submit" onClick={() => posting()}>저장하기</button>
  </div>
  )
}

export default CreatePostPage
