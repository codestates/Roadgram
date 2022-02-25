import React from 'react'
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { getMainArticles } from '../store/ArticleSlice'

function Article () {
  const { mainArticles } = useSelector((state: RootState) => state.articles);
  return (
    <div id="mainContainer">
    {mainArticles.map(article => {
      return (
        <div className="postBox" key={article.id}>
          <img src={article.thumbnail} alt="mainImage" className="mainImage" />
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