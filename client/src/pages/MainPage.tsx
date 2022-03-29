import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { RootState } from '..'
import { addMainArticles, getMainArticles, resetArticle } from '../store/ArticleSlice'
import { login, logout, newAccessToken } from '../store/AuthSlice'
import Article from '../components/Article'
import { resetCreatePost } from '../store/createPostSlice'
import { resetKaKao } from '../store/LocationListSlice'
import { resetRouteList } from '../store/RouteListSlice'
import { resetComments } from '../store/CommentsSlice'

function MainPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector(state => state)
  const isInitialMount = useRef(true)
  const { isLogin, accessToken, userInfo, refreshToken } = useSelector((state: RootState) => state.auth)
  const { mainArticles } = useSelector((state: RootState) => state.articles)
  // const { commentInfo } = useSelector((state: RootState) => state.comments)

  //   console.log(commentInfo)
  // dispatch(resetComments())
  const [page, setPage] = useState(3) // 페이지 정보
  const [end, setEnd] = useState(false) // 추가로 받아올 데이터 없을 시 더 이상 무한 스크롤 작동안하게 하는 상태값

  const [isRecent, setIsRecenst] = useState(true)
  // 액세스토큰 만료 시 재발급 요청

  const accessTokenRequest = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/auth?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
      {
        headers: { authorization: `${refreshToken}` },
      },
    )
    dispatch(newAccessToken(response.data.data))
  }
  // mainArticles에 recent데이터 받아와서 추가 에러 시 추가로딩 안되게
  const addRecentArticle = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=${page}`)
      dispatch(addMainArticles(response.data.data.articles))
    } catch {
      setEnd(true)
    }
  }
  // 로그인 상태 시 follower에 대한 데이터 받아와서 추가
  const addFollowerArticle = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=${page}`,
        { headers: { authorization: `${accessToken}` } },
      )
      dispatch(addMainArticles(response.data.data.articles))
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        // 액세스토큰 재발급 요청
        try {
          await accessTokenRequest()
        } catch {
          dispatch(logout())
          toast.error('다시 로그인해 주세요')
          navigate('/logins')
        }
        // 이전 요청 한번 더
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=${page}`,
            { headers: { authorization: `${accessToken}` } },
          )
          dispatch(addMainArticles(response.data.data.articles))
        } catch {
          setEnd(true)
        }
      }
      // 에러 시 더 이상 추가 랜더링 안되게
      else {
        setEnd(true)
      }
    }
  }

  const handleScroll = useCallback((): void => {
    const { innerHeight } = window
    const { scrollHeight, scrollTop } = document.documentElement
    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      if (!isRecent) {
        addFollowerArticle()
      } else {
        addRecentArticle()
      }
      setPage(page + 1)
    }
  }, [page, isRecent])

  useEffect(() => {
    if (!end) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [handleScroll])

  useEffect(() => {
    // 최초 렌더링 시 url에 있는 code값 전달
    if (isInitialMount.current) {
      const url = new URL(window.location.href)
      const authorizationCode = url.searchParams.get('code')
      // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
      // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
      if (authorizationCode) {
        getAccessToken(authorizationCode)
      }
      isInitialMount.current = false
    }
  }, [isLogin])

  console.log('state ==== ', state)
  // 최신순으로 데이터 받아와서 초기에 mainArticle 초기화
  const getRecentArticleHandler = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`)
      dispatch(getMainArticles(response.data.data.articles))
    } catch {
      dispatch(getMainArticles([]))
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=2`)
      dispatch(addMainArticles(response.data.data.articles))
    } catch {
      dispatch(addMainArticles([]))
    }
  }
  // 팔로워들 게시물 받아와서 mainArticles 초기화
  const getFollowArticleHandler = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=1`,
        { headers: { authorization: `${accessToken}` } },
      )
      console.log(response)
      dispatch(getMainArticles(response.data.data.articles))
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        // 엑세스 토큰 재발급 요청 리프레시 토큰 만료 시 로그아웃 처리
        try {
          await accessTokenRequest()
        } catch {
          dispatch(logout())
          toast.error('다시 로그인해 주세요')
          navigate('/logins')
        }
        // 재발급받은 토큰으로 다시 요청
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=1`,
            { headers: { authorization: `${accessToken}` } },
          )
          dispatch(getMainArticles(response.data.data.articles))
        } catch {
          dispatch(getMainArticles([]))
        }
      }
      // 에러 시 데이터 빈값으로 처리
      else {
        dispatch(getMainArticles([]))
      }
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=2`,
        { headers: { authorization: `${accessToken}` } },
      )
      dispatch(addMainArticles(response.data.data.articles))
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        // 액세스토큰 재발급 요청
        try {
          await accessTokenRequest()
        } catch {
          dispatch(logout())
          toast.error('다시 로그인해 주세요')
          navigate('/logins')
        }
        // 이전 요청 한번 더
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/articles?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}&page=${page}`,
            { headers: { authorization: `${accessToken}` } },
          )
          dispatch(addMainArticles(response.data.data.articles))
        } catch {
          dispatch(addMainArticles([]))
        }
      }
      // 에러 시 더 이상 추가 랜더링 안되게
      else {
        dispatch(addMainArticles([]))
      }
    }
  }

  // 카카오 accessToken 받아오기
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

  const recentButtonHandler = () => {
    setIsRecenst(true)
  }
  const followButtonHandler = () => {
    if (isLogin) {
      setIsRecenst(false)
    } else {
      toast.error('로그인이 필요합니다')
      navigate('/logins')
    }
  }

  // 스크롤 초기화
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  useEffect(() => {
    dispatch(getMainArticles([]))
    if (!isRecent) {
      getFollowArticleHandler()
    } else {
      getRecentArticleHandler()
    }
    setEnd(false)
    setPage(3)
  }, [isRecent, isLogin])

  return (
    <div className="main_whole_div">
      <div className="main_buttons">
        <button
          type="button"
          className={isRecent ? 'button_selected' : 'button_unSelected'}
          onClick={recentButtonHandler}
        >
          최신순
        </button>
        <button
          type="button"
          className={isRecent ? 'button_unSelected' : 'button_selected'}
          onClick={followButtonHandler}
        >
          팔로우
        </button>
      </div>
      {mainArticles.length === 0 || !mainArticles ? (
        <div className="no_following_post">팔로우 하는 사람 혹은 작성하신 게시물이 없습니다.</div>
      ) : (
        <Article />
      )}
    </div>
  )
}
export default MainPage
