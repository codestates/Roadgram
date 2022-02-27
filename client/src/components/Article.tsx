import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux'
import { getMainArticles } from '../store/ArticleSlice'
import { RootState } from '..'
import { detailInfo } from '../store/ArticleDetailSlice';

function Article () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mainArticles } = useSelector((state: RootState) => state.articles);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

  const updateTargetId = async (id: number) => {
    dispatch(detailInfo({targetId: id, userInfo: {}, articleInfo: {}}));
    navigate(`/postdetails?id=${id}`);
  }

  return (
    <div id="mainContainer">
    {mainArticles.map(article => {
      return (
        <div className="postBox" key={article.id}>
          <img src={article.thumbnail} alt="mainImage" className="mainImage" onClick={() => updateTargetId(article.id)} onKeyDown={() => updateTargetId(article.id)}/>
          <div className="tagBox">
            {article.tags
              .map((el: any) => {
                return { id: article.tags.indexOf(el), tag: el }
              })
              .map((ele: any) => {
                return (
                  <div className="tag" key={ele.id}>
                    {ele.tag}
                  </div>
                )
              })}
          </div>
          <div className="communityBox">
            <div className="nickname">{article.nickname}</div>
            <div className="iconBox">
              <FontAwesomeIcon className="mainIcon" icon={faHeart} />
              <div className="like">{article.totalLike}</div>
              <FontAwesomeIcon className="mainIcon" icon={faCommentDots} />
              <div className="reply">{article.totalComment}</div>
            </div>
          </div>
          <div />
        </div>
      )
    })}
    </div>
    )
}

export default Article;