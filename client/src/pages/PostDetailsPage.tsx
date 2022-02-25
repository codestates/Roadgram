import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '..';
import ContentsDetail from '../components/ContentsDetail';
import Media from '../components/Media';
import Track from '../components/Track';
import '../styles/pages/_postdetailsPage.scss';

function PostDetailsPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // 게시물 상세 조회 API 요청
  const getPostDetails = async () => {
    // 로그인하지 않은 경우 들어갈 user id 값 구분할 것

  }
  getPostDetails();

  return (
    <div className="total-container">
      <div className="post-details-container">
        <div className="media-track-box">
          <div className="media">
            <Media />
          </div>
          <div className="track">
            <Track />
          </div>
        </div>
        <div className="contents-detail-box">
          <ContentsDetail />
        </div>
      </div>
    </div>
  )
}

export default PostDetailsPage;
