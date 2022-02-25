import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './_contentsDetails.scss';

function ContentsDetail() {
  // create Comment API 요청
  // update Comment API 요청
  // delete Comment API 요청

  return (
    <div className="detail-container">
        <div className="post-info">
          <div className="profile-image">ProfileImage</div>
          <div className="nickname">Nickname&written time</div>
          <div className="post-delete">삭제 버튼</div>
          <div className="post-modify">수정 버튼</div>
        </div>
        <div className="post-text">시인의 소학교 나의 자나고 것은 하나에 아름다운 계절이 까닭입니다. 밤이 마리아 새겨지는 추억과 별 않은 봅니다. 아침이 하늘에는 우는 까닭입니다. 잔디가 쉬이 무엇인지 해일 당신은 별 있습니다. 별들을 다 하나에 사람들의 애기 둘 이름을 계십니다. 아직 경, 하나의 했던 별들을 차 이름과 언덕 덮어 듯합니다. 노루, 이름자 속의 밤이 하나에 지나고 소녀들의 우는 봅니다.</div>
        <div className="post-tags">
          <div className="each-tags">
            Tags
          </div>
        </div>        
        <div className="iconBox">
          <FontAwesomeIcon className="mainIcon" icon={faHeart} />
          <div className="like">totalLike</div>
          <FontAwesomeIcon className="mainIcon" icon={faCommentDots} />
          <div className="reply">totalComment</div>
        </div>
        <div className="comment-writing">
          <h3 className="comment-writing-title">댓글쓰기</h3>
          <div className="comment-writing-box">
            <input className="writing-box"/>
            <button type="submit" className="comment-submit">작성</button>
          </div>
        </div>
        <div className="post-comments">
          commentList(profile image, nickname, written time, text, delete&modify button)
        </div>
    </div>
  )
}

export default ContentsDetail;