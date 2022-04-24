import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { RootState } from '..'
import { addMainArticles, getMainArticles } from '../store/ArticleSlice'
import Article from '../components/Article'

function SearchPage() {
  const dispatch = useDispatch();
  const { mainArticles, tag } = useSelector((state: RootState) => state.articles);
  const [word, setWord] = useState("");
  const [page, setPage] = useState(3);
  const [end, setEnd] = useState(false); // 없으면 요청 더이상 안보내게 판단하는 상태

  // 스크롤 초기화
  useEffect(()=>{
    document.documentElement.scrollTop=0;
  },[]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get('tag');
    console.log(`url = ${url}, keyword = ${keyword}`)
    dispatch(getMainArticles([]));
    setPage(3);
    setEnd(false);
    if (keyword) {
      searching(keyword);
      setWord(keyword)
    }
    // 빈값으로 검색해도 요청 다시 가게끔 수정
    else {
      searching('');
      setWord('')
    }
  }, [tag])

  // 게시물 추가로 받아오는 함수
  const addArticle = async () => {
    if (word === '') {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=${page}`);
        dispatch(addMainArticles(res.data.data.articles));
      } catch {
        setEnd(true); // 게시물 더이상 없으면 종료
      }
    } else {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/search?tag=${word}&page=${page}`);
        dispatch(addMainArticles(res.data.data.articles));
      } catch {
        setEnd(true); // 게시물 더이상 없으면 종료
      }
    }
  }
  // 스크롤에 따른 콜백함수
  const handleScroll = useCallback((): void => {
    const { innerHeight } = window;
    const { scrollHeight, scrollTop } = document.documentElement;
    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      addArticle();
      setPage(page + 1);
    }
  }, [page, word])

  const searching = async (word: string) => {
    // word가 빈값일 때
    if (word === "") {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`);
        dispatch(getMainArticles(res.data.data.articles));
      } catch {
        dispatch(getMainArticles([]));
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=2`);
        dispatch(addMainArticles(res.data.data.articles));
      } catch {
        setEnd(true); // 게시물 더이상 없으면 종료
      }

      // word가 있을 때
    } else {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/search?tag=${word}&page=1`);
        dispatch(getMainArticles(res.data.data.articles));
      } catch {
        dispatch(getMainArticles([]));
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/search?tag=${word}&page=2`);
        dispatch(addMainArticles(res.data.data.articles));
      } catch {
        setEnd(true); // 게시물 더이상 없으면 종료
      }
    }
  }

  // 스크롤 이벤트 추가
  useEffect(() => {
    if (!end) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    }
  }, [handleScroll])

  return (
    mainArticles.length === 0 || !mainArticles
      ? <div className="no_following_post">{`'${word}'에 해당하는 게시물을 찾을 수 없습니다.`}</div>
      : (<div className='main_whole_div'><Article /></div>)
  )
}

export default SearchPage


