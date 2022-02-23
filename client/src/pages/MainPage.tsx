import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faC, faTags } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '..'
import { getArticleRecent } from '../store/AticleSlice'

function MainPage() {
  const dispatch = useDispatch()
  const { isLogin } = useSelector((state: RootState) => state.auth)
  const { articleRecent } = useSelector((state: RootState) => state.articles)

  const getRecentArticleHandler = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`)
    dispatch(getArticleRecent(response.data.data.articles))
  }

  useEffect(() => {
    getRecentArticleHandler()
  }, [])

  return (
    <div id="mainContainer">
      {articleRecent.map(article => {
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
                <FontAwesomeIcon className="heartIcon" icon={faHeart} />
                <div className="like">12</div>
                <FontAwesomeIcon className="commentIcon" icon={faCommentDots} />
                <div className="reply">3</div>
              </div>
            </div>
            <div />
          </div>
        )
      })}
    </div>
  )
}

export default MainPage
