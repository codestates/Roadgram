import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import { update } from '../store/UserInfoSlice';
import './_contentsDetails.scss';

function Comments() {
  // create Comment API 요청
  // update Comment API 요청
  // delete Comment API 요청
  // 상태갖고오기
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

  const moveToUserPage = (targetId: any) => {
    dispatch(update({targetId, userInfo: {}, articles: []}));
    navigate(`/userinfo?id=${targetId}`);
  }

  return (
    <div className="comments-container">
        <div className="comment-writing">
          <h3 className="comment-writing-title">댓글쓰기</h3>
          <div className="comment-writing-box">
            <input className="writing-box"/>
            <button type="submit" className="comment-submit">작성</button>
          </div>
        </div>
        <div className="post-comments">
          commentList(profile image, nickname, written time, text, delete&modify button)
          {articleInfo.comments
          ? articleInfo.comments.map(each => {
            return (
              <li
                className="follow_profile_list"
                key={each.id}
                onClick={() => {
                  moveToUserPage(each.id)
                }}
                onKeyDown={() => {
                  moveToUserPage(each.id)
                }}
              >
                <img alt="profile_image" src={each.profileImage} className="follow_profile_image" />
                <span>{each.nickname}</span>
                <span>{each.createdAt}</span>
                <div>{each.comment}</div>
              </li>
            )
          })
          : <div>1</div>
        }
        </div>
    </div>
  )
}

export default Comments;