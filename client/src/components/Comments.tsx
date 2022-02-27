import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import { getComments } from '../store/ArticleDetailSlice';
import { update } from '../store/UserInfoSlice';
import './_contentsDetails.scss';

function Comments() {
  // 상태갖고오기
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id: string | null = url.searchParams.get('id');
    getArticleComments(Number(id));
  }, [targetId]);

  const getArticleComments = async (id: number) => {
    await axios.get(
      `${process.env.REACT_APP_API_URL}/comments?id=${id}&page=${1}`
    ).then(res => {
      console.log(res.data);
      dispatch(getComments(res.data));
    })
  }
  
  const createComment = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/comments`,
      {
        loginMethod: userInfo.loginMethod,
        user: userInfo.id,
        articleId: articleInfo.id,
        comment: 'Input 박스에 작성한 string 값'
      },
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      console.log(res.data);
      // 추가된 댓글 목록 업뎃 및 반환
      // input 박스 clear
    })
  }

  // 댓글마다 수정 버튼에 연결(해당 댓글 id 값 받아오기)
  // nightmare
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
      // dispatch(getComments(res.data))
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
      // dispatch()
    })
  }

  const moveToUserPage = (targetId: any) => {
    dispatch(update({targetId, userInfo: {}, articles: []}));
    navigate(`/userinfo?id=${targetId}`);
  }

  // 수정, 삭제 버튼 생성해야함.
  return (
    <div className="comments-container">
        <div className="comment-writing">
          <h3 className="comment-writing-title">댓글쓰기</h3>
          <div className="comment-writing-box">
            <input className="writing-box"/>
            <button type="submit" className="comment-submit" onClick={createComment}>작성</button>
          </div>
        </div>
        <div className="post-comments">
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