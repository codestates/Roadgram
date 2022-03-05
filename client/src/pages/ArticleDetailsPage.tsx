import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '..'
import ContentsDetail from '../components/ContentsDetail'
import Media from '../components/Media'
import Track from '../components/Track'
import { detailInfo } from '../store/ArticleDetailSlice'
import { getComments } from '../store/CommentsSlice'

function PostDetailsPage() {
  const dispatch = useDispatch()
  // article detail 상태 정보 갖고 오기
  const { userInfo, accessToken } = useSelector((state: RootState) => state.auth)
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails)

  // 스크롤 초기화
  useEffect(()=>{
    document.documentElement.scrollTop=0;
  },[]);
  
  useEffect(() => {
    const url = new URL(window.location.href)
    const id: string | null = url.searchParams.get('id')
    getArticleDetails(Number(id))
    getArticleComments(Number(id))
  }, [targetId])

  const getArticleDetails = async (id: number) => {
    await axios.get(`${process.env.REACT_APP_API_URL}/articles/detail?id=${id}&user=${userInfo.id}`).then(res => {
      dispatch(detailInfo(res.data.data))
    })
  }

  const getArticleComments = async (id: number) => {
    await axios.get(`${process.env.REACT_APP_API_URL}/comments?id=${id}&page=${1}`).then(res => {
      dispatch(getComments(res.data.data))
    }).catch(err => {
      dispatch(getComments([]))
    })
  }

  return (
    <div className="total-container">
      <div className="media-track-box">
        <Media />
        <Track />
      </div>
      <div className="contents-detail-box">
        <ContentsDetail />
      </div>
    </div>
  )
}

export default PostDetailsPage
