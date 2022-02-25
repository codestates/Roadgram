import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { RootState } from '..'
import { getMainArticles } from '../store/ArticleSlice'
import { login } from '../store/AuthSlice'
import Article from '../components/Article'

function SearchPage() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const { isLogin, accessToken, userInfo } = useSelector((state: RootState) => state.auth);
  const { mainArticles, tag } = useSelector((state: RootState) => state.articles);
  const isInitialMount = useRef(true)
  const [word, setWord] = useState("");

  useEffect(() => {   
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get('tag');
    if (keyword) {
      searching(keyword);
      setWord(keyword)
    }
  },[tag])

  const searching = async (word: string) => {
    const page = 1;

    // word가 빈값일 때
    if(word === "") {
      axios
      .get(`${process.env.REACT_APP_API_URL}/articles/recent?page=${page}`)
      .then((res) => {
        if(res.data.statusCode === 204) {
          dispatch(getMainArticles([]));
        } else {
          dispatch(getMainArticles(res.data.data.articles));
        }
      })
      .catch((err) => {
        dispatch(getMainArticles([]));
      })
    // word가 있을 때
    } else {
      await axios
      .get(`${process.env.REACT_APP_API_URL}/search?tag=${word}&page=${page}`)
      .then((res) => {
        if(res.data.statusCode === 204) {
          dispatch(getMainArticles([]));
        } else {
          dispatch(getMainArticles(res.data.data.articles));
        }
      })
      .catch((err) => {
        dispatch(getMainArticles([]));
      }
      )
    }
  }
    return (
      mainArticles.length === 0 || !mainArticles 
      ? <div className="no_following_post">{`'${word}'에 해당하는 게시물을 찾을 수 없습니다.`}</div>
      : <Article/>
      )
    }
  export default SearchPage


