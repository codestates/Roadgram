import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { getMainArticles } from '../store/ArticleSlice'
import { RootState } from '..'
import { detailInfo } from '../store/ArticleDetailSlice'
import { resetCreatePost } from '../store/createPostSlice'
import { resetKaKao } from '../store/LocationListSlice'
import { resetRouteList } from '../store/RouteListSlice'

function Article() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { mainArticles } = useSelector((state: RootState) => state.articles)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails)

  useEffect(() => {
    console.log('Article 작동!!')
    // main이 불러와지면 post 작성정보를 초기화시켜준다.
    resetPostInfo()
  }, [])

  const resetPostInfo = () => {
    dispatch(resetCreatePost())
    dispatch(resetKaKao())
    dispatch(resetRouteList())
  }

  const updateTargetId = async (id: number) => {
    dispatch(detailInfo({ targetId: id, userInfo: {}, articleInfo: {} }))
    navigate(`/postdetails?id=${id}`)
  }

  return (
    <div id="mainContainer">
      {mainArticles.map(article => {
        return (
          <div className="postBox" key={article.id}>
            <img
              src={article.thumbnail}
              alt="mainImage"
              className="mainImage"
              onClick={() => updateTargetId(article.id)}
              onKeyDown={() => updateTargetId(article.id)}
            />
            <div className="tagBox">
              {article.tags
                .map((el: any) => {
                  return { id: article.tags.indexOf(el), tag: el }
                })
                .map((ele: any) => {
                  return (
                    <div className="tag" key={ele.id}>
                      #{ele.tag}
                    </div>
                  )
                })}
            </div>
            <div className="communityBox">
              <img
                className="profileImage"
                alt="profileImage"
                src="https://search.pstatic.net/common/?src=http%3A%2F%2Fcafefiles.naver.net%2F20150809_137%2Fx_o97_1439095643355YwvXT_JPEG%2FNa1439095638572.jpg&type=sc960_832"
              />
              <div className="nickname">{article.nickname}</div>
              <div className="iconBox">
                <FontAwesomeIcon className="mainIcon_heart" icon={faHeart} />
                <div className="like">관심 {article.totalLike}</div>
                <FontAwesomeIcon className="mainIcon_comment" icon={faCommentDots} />
                <div className="reply">댓글 {article.totalComment}</div>
              </div>
            </div>
            <div />
          </div>
        )
      })}
    </div>
  )
}

export default Article
