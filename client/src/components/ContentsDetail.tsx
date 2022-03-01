import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { RootState } from '..';
import '../styles/components/_contentsDetails.scss';
import { detailInfo } from '../store/ArticleDetailSlice';
import { articleDeleteModal } from '../store/ModalSlice';
import { likeUnlike } from '../store/ArticleDetailSlice';
import ArticleDeleteModal from './Modals/articleDeleteCheck';
import { setTag } from '../store/ArticleSlice';


function ContentsDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // article detail 상태 정보 갖고 오기
  const { userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { isArticleDeleteModal } = useSelector((state: RootState) => state.modal);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

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
        headers: { authorization: `${accessToken}` }
      }
    ).then(res => {
      console.log(res.data)
    })
  }
  
  // 삭제 버튼 클릭 시 실행
  const deleteArticle = async () => {
    dispatch(articleDeleteModal(!isArticleDeleteModal));
  }

  // 수정 버튼 온클릭 연결
  const moveToEdit = async () => {
    // 편집 페이지로 이동
  }

  const likeUnlikeHandler = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/likes`,
      {
        user: userInfo.id,
        articleId: articleInfo.id,
        loginMethod: userInfo.loginMethod
      },
      {
        headers: { authorization: `${accessToken}` }
      }
    ).then((res) => {
      console.log(res.data);
      dispatch(likeUnlike(res.data.data.totalLikes));
    })
  }

  return (
    <div className="detail-container">
        <div className="post-info">
          <img className="writer_profile_image" alt="profile_image" src={writerInfo.profileImage}/>
          <div className="nickname_time-box">
            <div className="writer_nickname">{writerInfo.nickname}</div>
            <div className="written_time">{`${String(articleInfo.createdAt).slice(0, 10)} ${String(articleInfo.createdAt).slice(11, 16)}`}</div>
          </div>
          {
            userInfo.id === writerInfo.id
            ? <div className="article-buttons">
                <button className="post-delete" type="button" onClick={deleteArticle}>삭제</button>
                <button className="post-modify" type="button">수정</button>
              </div>
            : null
          }
        </div>
        <div className="post-text">{articleInfo.content}</div>
        <div className="post-tags"> 
          {articleInfo.tags
          ? articleInfo.tags.map((tag: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
            return (
              <div>
                <Link to={`/search?tag=${tag}`}>
                  <span className="each-tags" key={articleInfo.tags.indexOf(tag)}>{`#${tag}`}</span>
                </Link>
              </div>
            )
          }) : null}
        </div>        
        <div className="iconBox">
          <FontAwesomeIcon className="articleIcons" icon={faHeart} onClick={likeUnlikeHandler} onKeyDown={likeUnlikeHandler}/>
          <div className="totallikes">{articleInfo.totalLike}</div>
          <FontAwesomeIcon className="articleIcons" icon={faCommentDots} />
          <div className="totalcomments">{articleInfo.totalComment}</div>
        </div>
        <div className="comments-container">
          <Comments />
        </div>
        {isArticleDeleteModal ? <ArticleDeleteModal /> : null}
    </div>
  )
}

export default ContentsDetail;