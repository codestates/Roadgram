import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { RootState } from '..'
import Tag from '../components/CreatePostPage/Tag'
import TextArea from '../components/CreatePostPage/TextArea'
import Upload from '../components/CreatePostPage/Upload'
import { addRouteList, resetRouteList } from '../store/RouteListSlice'
import { resetKaKao } from '../store/LocationListSlice'
import { resetCreatePost, setContent, setTagsInfo, setThumbnail } from '../store/createPostSlice'
import UploadHold from '../components/CreatePostPage/UploadHold'

function EditPostPage() {
  const state = useSelector((state: RootState) => state);
  const postInfo = useSelector((state: RootState) => state.createPost);
  const {isLogin,userInfo, accessToken} = useSelector((state: RootState) => state.auth)
  const {articleInfo, writerInfo} = useSelector((state: RootState) => state.articleDetails)
  const { routeList } = useSelector((state:RootState) => state.routes);
  const {content, tagsInfo, thumbnail} = postInfo;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.scrollTop=0; // 스크롤 초기화
    // createpost slice 값 세팅
    setEditPage()
    // url에서 id값 추출
    const url = new URL(window.location.href)
    const id: string | null = url.searchParams.get('id')
    // 첫 렌더링 시 유저 일치 여부 and 게시물 일치 여부 확인(state와 비교)

    if(!isLogin){
      alert('로그인이 필요한 서비스입니다.');
      navigate('/logins');
    }
    else if(userInfo.id !== writerInfo.id ||Number(id) !== articleInfo.id ) {
      alert("접근할 수 없는 경로입니다.")
      navigate('/main')
    }
  }, [])

  const setEditPage = () => {
    
    // 기존 포스트정보가 initialState 상태일때만 실행
    // 기존 정보가 있으면 editPage state를 다시 실행하지 않음
    if(postInfo.content === "" && postInfo.thumbnail=== "" && tagsInfo.length === 0) {
      // 태그 재저장
      const newTags: { order: number; tagName: string; }[] = []
      articleInfo.tags.forEach((tag: string, idx: number) => {
        const newObj = {
          order: idx + 1,
          tagName: tag
        }
        newTags.push(newObj);
      })
      dispatch(setTagsInfo(newTags));
    
      // 썸네일 재저장
      dispatch(setThumbnail(articleInfo.thumbnail)); 
      // content 재저장
      dispatch(setContent(articleInfo.content));
      // roads 재저장
      articleInfo.roads.forEach((road) => {
        dispatch(addRouteList(road));
      })
    }
  }

  const posting = () => {
    if (content === '') {
      alert('본문은 필수 입력 정보입니다.')
      return
    }

    let isImageNull = true
    routeList.forEach(route => {
      if (route.imageSrc === '') isImageNull = false
    })

    if (!isImageNull) {
      alert(`모든 경로의 이미지를 업로드 해 주시기 바랍니다.`)
      return
    }

    if (!thumbnail || thumbnail === '') {
      alert('썸네일을 선택 해주시기 바랍니다.')
      return
    }

    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/articles`,
        {
          user: userInfo.id,
          articleId: articleInfo.id,
          content,
          tag: tagsInfo,
          loginMethod: userInfo.loginMethod,
        },
        {
          headers: {
            authorization: `${accessToken}`,
          },
        },
      )
      .then(res => {
        alert('수정이 완료되었습니다.')
        navigate(`/postdetails?id=${res.data.data.articleInfo.id}`)
        resetPostInfo()
      })
      .catch(err => {
        alert('수정에 실패했습니다.')
        console.log('err!', err)
      })
  }
  const resetPostInfo = () => {
    dispatch(resetCreatePost())
    dispatch(resetKaKao())
    dispatch(resetRouteList())
  }

  const cancelPost = () => {
    resetPostInfo()
    navigate(`/postdetails?id=${articleInfo.id}`)
  }

  return (
    <div className="createpost_container">
      <div className="createpost_whole_div">
        <div className="createpost_title_div">
          <div className="arrow_icon_div">
            <FontAwesomeIcon icon={faArrowLeft} className="arrow_icon" onClick={() => cancelPost()} />
          </div>
          <h1>게시글 수정</h1>
          <span className="inform_span">※ 게시물 수정은 태그와 본문 수정만 가능합니다.</span>
        </div>
        <section className="createpost_tag_section">
          <div className="createpost_tag_title">* 태그 입력</div>
          <Tag />
        </section>
        <section className="createpost_content_section">
          <div className="createpost_content_title">* 본문 입력</div>
          <TextArea />
        </section>
        <section className="createpost_upload_section">
          <span className="createpost_upload_title">* 이미지 업로드 (수정 불가)</span>
          <UploadHold />
        </section>
        <div className="createpost_submit_button_div">
          <button className="createpost_submit_button" type="submit" onClick={() => posting()}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPostPage
