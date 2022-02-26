/* 무한스크롤 구현 페이지 */

import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Article from "../components/Article";
import Footer from '../components/Footer';
import { addMainArticles, getMainArticles } from '../store/ArticleSlice';

export default function Test() {
    const dispatch = useDispatch();

    const [page, setPage] = useState(2);
    const [end, setEnd] = useState(false);
    /* 처음 페이지 요청 */
    const getFirst = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=1`)
        dispatch(getMainArticles(res.data.data.articles));
    }
    /* 추가 페이지 요청 */
    const addArticle = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/articles/recent?page=${page}`)
        dispatch(addMainArticles(res.data.data.articles))
        if (!res.data.data.articles.length) setEnd(true);
    }
    /* 스크롤 시 실행되는 함수 */
    const handleScroll = useCallback((): void => {
        const { innerHeight } = window;
        const { scrollHeight } = document.documentElement;
        const { scrollTop } = document.documentElement;
        if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
            addArticle();
            setPage(page + 1);
        }
    }, [page])
    /* 최초 랜딩 시 */
    useEffect(() => {
        getFirst();
    }, [])
    /* 스크롤 발생 시 */
    useEffect(() => {
        if (!end) {
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [handleScroll])

    return (
        <div>
            <Article />
            <Footer/>
        </div>
    )
}