import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '..';
import ContentsDetail from '../components/ContentsDetail';
import Media from '../components/Media';
import Track from '../components/Track';
import { detailInfo, getComments } from '../store/ArticleDetailSlice';
import '../styles/pages/_postdetailsPage.scss';

function PostDetailsPage() {

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
