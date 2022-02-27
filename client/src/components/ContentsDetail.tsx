import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './Comments';
import { RootState } from '..';
import './_contentsDetails.scss';
import { detailInfo } from '../store/ArticleDetailSlice';


function ContentsDetail() {
  const dispatch = useDispatch();
  // article detail 상태 정보 갖고 오기
  const { userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id: string | null = url.searchParams.get('id');
    getArticleDetails(Number(id));
  }, [targetId]);

  const getArticleDetails = async (id: number) => {
    await axios.get(
      `${process.env.REACT_APP_API_URL}/articles/detail?id=${id}&user=${userInfo.id}`).then(res => {
        console.log(res.data.data);
        dispatch(detailInfo(res.data.data)); // article detail 정보 update
      })
  }

  // 수정 버튼 클릭 후 편집 모드 이동, 게시물 저장 시 실행
  const updateArticle = async () => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/articles`,
      {
        loginMethod: userInfo.loginMethod,
        user: userInfo.id,
        articleId: articleInfo.id,
        content: '수정할 게시물 텍스트',
        tags: ['수정할 태그들']
      },
      {
        headers: { authorization: `${accessToken}`}
      }
    ).then(res => {
      console.log(res.data)
    })
  }
  
  // 삭제 버튼 클릭 시 실행
  const deleteArticle = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/articles?id=${articleInfo.id}&user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
      {
        headers: { authorization: `${accessToken}`}
      }
    ).then(res => {
      console.log(res.data)
    })
  }

  return (
    <div className="detail-container">
        <div className="post-info">
          <img className="follow_profile_image" alt="profile_image" src={writerInfo.profileImage}/>
          <div className="nickname">{writerInfo.nickname}</div>
          <div className="nickname">{articleInfo.createdAt}</div>
          <div className="post-delete">삭제 버튼</div>
          <div className="post-modify">수정 버튼</div>
        </div>
        <div className="post-text">{articleInfo.content}</div>
        <div className="post-tags"> 
          {articleInfo.tags
          ? articleInfo.tags.map((tag: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
            return (
              <span className="each-tags">{tag}</span>
            )
          }) : null}
        </div>        
        <div className="iconBox">
          <FontAwesomeIcon className="mainIcon" icon={faHeart} />
          <div className="like">{articleInfo.totalLike}</div>
          <FontAwesomeIcon className="mainIcon" icon={faCommentDots} />
          <div className="reply">{articleInfo.totalComment}</div>
        </div>
        <div className="comments-container">
          <Comments />
        </div>
    </div>
  )
}

export default ContentsDetail;