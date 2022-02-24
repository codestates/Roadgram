import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { RootState } from '..'
import { getMainArticles } from '../store/ArticleSlice'
import { login } from '../store/AuthSlice'

function MainPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector(state => state)
  const isInitialMount = useRef(true)
  const { isLogin, accessToken, userInfo } = useSelector((state: RootState) => state.auth)
  const { mainArticles } = useSelector((state: RootState) => state.articles)

  const getRecentArticleHandler = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`)
    dispatch(getMainArticles(response.data.data.articles))
  }

  const getFollowArticleHandler = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=1`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    )
    dispatch(getMainArticles(response.data.data.articles))
  }

  // console.log('state ===', state)

  useEffect(() => {      
    
    if(isLogin) {
      getFollowArticleHandler()  
    } else {
      getRecentArticleHandler()
    }

    if (isInitialMount.current) {
      // 로그인 여부에 따라 변경

      const url = new URL(window.location.href)
      const authorizationCode = url.searchParams.get('code')
      // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
      // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
      if (authorizationCode) {
        getAccessToken(authorizationCode)
      }
      isInitialMount.current = false
    }
  }, [])

  async function getAccessToken(code: string) {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/login/kakao`, { code })
      .then(res => {
        console.log('응답 데이터 ===', res.data)
        dispatch(login(res.data.data))
        navigate('/main')
      })
      .catch(err => console.log(err))
  }

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
export default MainPage
