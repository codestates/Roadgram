import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import { addComment, getComments, removeComment } from '../store/CommentsSlice';
import { update } from '../store/UserInfoSlice';
import './_contentsDetails.scss';

function Comments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);
  const { commentInfo } = useSelector((state: RootState) => state.comments);
  const [ comment, setComment ] = useState('');

  const newComment = (e: any) => {
    setComment(e.target.value);
  }

  const createComment = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/comments`,
      {
        loginMethod: userInfo.loginMethod,
        user: userInfo.id,
        articleId: articleInfo.id,
        comment
      },
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      console.log(res.data);
      dispatch(addComment(res.data));
    })
    await axios.get(
      `${process.env.REACT_APP_API_URL}/comments?id=${articleInfo.id}&page=${1}`)
      .then(res => {
        console.log(res.data.data);
        dispatch(getComments(res.data.data));
    })
  }

  // 댓글마다 수정 버튼에 연결(해당 댓글 id 값 받아오기)
  // Nightmare
  const updateComment = async (id: number) => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/comments`,
      {
        loginMethod: userInfo.loginMethod,
        commentId: id,
        comment: '새로 수정한 댓글(수정 작업하는 위치는 어디?)'
      },
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      console.log(res.data);
    })
  }

    // 댓글마다 삭제 버튼에 연결(해당 댓글 id 값 받아오기)
  const deleteComment = async (id: number) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/comments?loginMethod=${userInfo.loginMethod}&commentId=${id}&articleId=${articleInfo.id}&user=${userInfo.id}`,
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      console.log(res);
      dispatch(removeComment(id));
    }).then(() => {
      navigate(`/postdetails?id=${articleInfo.id}`);
    }).catch(() => {
      navigate(`/postdetails?id=${articleInfo.id}`);
    })
  }

  // 수정, 삭제 버튼 생성해야함.
  return (
    <div className="comments-container">
        <div className="comment-writing">
          <h3 className="comment-writing-title">댓글쓰기</h3>
          <div className="comment-writing-box">
            <input className="writing-box" type="text" value={comment} onChange={newComment}/>
            <button type="submit" className="comment-submit" onClick={createComment}>작성</button>
          </div>
        </div>
        <div className="post-comments">
          {commentInfo
          ? commentInfo.map(each => {
            return (
              <li
                className="follow_profile_list"
                key={each.id}
              >
                <img
                  alt="profile_image"
                  src={each.profileImage}
                  className="follow_profile_image" 
                  onClick={() => {navigate(`/userinfo?id=${each.userId}`)}}
                  onKeyDown={() => {navigate(`/userinfo?id=${each.userId}`)}} />
                <span>{each.nickname}</span>
                <span>{each.createdAt}</span>
                <div>{each.comment}</div>
                <button type="button" onClick={() => deleteComment(each.id)}>삭제</button>
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