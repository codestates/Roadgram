import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import Comments from './Comments';
import { RootState } from '..';
import './_contentsDetails.scss';


function ContentsDetail() {
  // article detail 상태 정보 갖고 오기
  const { writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

  return (
    <div className="detail-container">
        <div className="post-info">
          <div className="profile-image">ProfileImage</div>
          <div className="nickname">{writerInfo.nickname}</div>
          <div className="nickname">{articleInfo.createdAt}</div>
          <div className="post-delete">삭제 버튼</div>
          <div className="post-modify">수정 버튼</div>
        </div>
        <div className="post-text">{articleInfo.content}</div>
        <div className="post-tags">
          <div className="each-tags">
            {articleInfo.tags}
          </div>
        </div>        
        <div className="iconBox">
          <FontAwesomeIcon className="mainIcon" icon={faHeart} />
          <div className="like">{articleInfo.totalLike}</div>
          <FontAwesomeIcon className="mainIcon" icon={faCommentDots} />
          <div className="reply">{articleInfo.totalComment}</div>
        </div>
        <div className="comments-container">
          <Comments />
        </div>
    </div>
  )
}

export default ContentsDetail;