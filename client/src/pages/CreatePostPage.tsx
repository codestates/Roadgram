import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '..';
import Tag from '../components/CreatePostPage/Tag';
import TextArea from '../components/CreatePostPage/TextArea';
import Upload from '../components/CreatePostPage/Upload';
import { resetRouteList } from '../store/RouteListSlice';
import { resetKaKao } from '../store/LocationListSlice';
import { resetCreatePost } from '../store/createPostSlice';

function CreatePostPage() {
  const state = useSelector((state: RootState) => state);
  const postInfo = useSelector((state: RootState) => state.createPost);
  const {userInfo, accessToken} = useSelector((state: RootState) => state.auth)
  const { routeList } = useSelector((state:RootState) => state.routes);
  const {content, tagsInfo, thumbnail} = postInfo;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("전체 state ==", state);
    console.log("post 입력 정보 ==", postInfo);
  }, [state, postInfo]);

  const posting = () => {
    if(content === "") {
      alert("본문은 필수 입력 정보입니다.");
      return;
    }
    
    let isImageNull = true
    routeList.forEach((route) => {
      if(route.imageSrc === "")
        isImageNull = false
    })

    if(!isImageNull) {
      alert(`모든 경로의 이미지를 업로드 해 주시기 바랍니다.`);
      return;
    }

    if(!thumbnail || thumbnail === "") {
      alert("썸네일을 선택 해주시기 바랍니다.")
      return;
    }

    axios
    .post(`${process.env.REACT_APP_API_URL}/articles`,
    {
      user: userInfo.id,
      content,
      road: routeList,
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
    .then((res) => {
      alert("작성이 완료되었습니다.");
      navigate(`/postdetails?id=${res.data.data.articleInfo.id}`);
      resetPostInfo();
    })
    .catch((err) => {
      console.log("err!", err);
    });
  }
  const resetPostInfo = () => {
    dispatch(resetCreatePost());
    dispatch(resetKaKao());
    dispatch(resetRouteList());
  }

  const cancelPost = () => {
    if(window.confirm("취소하시면 작성하신 내용을 모두 잃게됩니다. 계속 하시겠습니까?")) {
      resetPostInfo();
      navigate('/main');
    }
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
    <div className='createpost_tag_section'>
      <span className='createpost_tag_title'>* 태그</span>
      <Tag/>
    </div>
    <div className='createpost_content_section'>
      <span className='createpost_content_title'>* 본문</span>
      <TextArea/>
    </div>
    <div className='createpost_upload_section'>
      <span className='createpost_upload_title'>* 이미지 업로드</span>
      <Upload/>
    </div>
    <div className='createpost_submit_button_div'>
      <button className='createpost_cancel_button' type="button" onClick={() => cancelPost()}>작성취소</button>
      <button className='createpost_submit_button' type="submit" onClick={() => posting()}>저장하기</button>
    </div>
  </div>
  )
}

export default CreatePostPage
