import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faC, faTags } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '..'
import { getArticleRecent } from '../store/AticleSlice'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/AuthSlice';

function MainPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector((state) => state);
  const isInitialMount = useRef(true);
  const { isLogin } = useSelector((state: RootState) => state.auth)
  const { articleRecent } = useSelector((state: RootState) => state.articles)

  const getRecentArticleHandler = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`)
    dispatch(getArticleRecent(response.data.data.articles))
  }

  useEffect(() => {
    getRecentArticleHandler()
    if (isInitialMount.current) {
       isInitialMount.current = false;
       const url = new URL(window.location.href)
       const authorizationCode = url.searchParams.get('code')
       // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
       // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
       if (authorizationCode) {
           getAccessToken(authorizationCode)
       }
     }
  }, [])
    
 
   async function getAccessToken(code: string) {
    await axios
    .post(`${process.env.REACT_APP_API_URL}/users/login/kakao`, { code })
    .then((res) => {
      console.log("응답 데이터 ===", res.data);
      dispatch(login(res.data.data));
      navigate('/main')
    })
    .catch((err) => console.log(err));
  }

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
