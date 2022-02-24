import React from 'react'
import ContentsDetail from '../components/ContentsDetail';
import Track from '../components/Track';

function PostDetailsPage() {
  return (
    <div className="post-details-container">
      <div className="map-pictures-box">Map and Pictures</div>
      <div className="contents-detail-box">
        <ContentsDetail />
      </div>
      <div className="track-box">
        <Track />
      </div>
    </div>
  )
}

export default PostDetailsPage;
