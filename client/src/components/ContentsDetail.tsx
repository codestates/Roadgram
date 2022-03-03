import { faCommentDots, faHeart as solidHeart, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { RootState } from '..';
// import '../styles/components/_contentsDetails.scss';
import { detailInfo, updateTotalComments } from '../store/ArticleDetailSlice';
import { articleDeleteModal } from '../store/ModalSlice';
import { likeUnlike } from '../store/ArticleDetailSlice';
import ArticleDeleteModal from './Modals/articleDeleteCheck';
import { setTag } from '../store/ArticleSlice';
import { addComment, getComments, removeComment, resetComments } from '../store/CommentsSlice';


function ContentsDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // article detail 상태 정보 갖고 오기
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { isArticleDeleteModal } = useSelector((state: RootState) => state.modal);
  const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);
  const { commentInfo } = useSelector((state: RootState) => state.comments);
  const [ comment, setComment ] = useState('');
  const [ otherComment, setOtherComment ] = useState('');
  const [ likedOrNot, setLikedOrNot ] = useState(articleInfo.likedOrNot);
  const [ isUpdatable, setIsUpdatable ] = useState(false);
  const [ targetCommentId, setTargetCommentId ] = useState(0);
  const [ targetComment, setTargetComment ] = useState('');

  // 수정 버튼 클릭 후 편집 모드 이동, 게시물 저장 시 실행하는 핸들러. 여기 아님
  const updateArticle = async () => {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/articles`,
      {
        loginMethod: userInfo.loginMethod,
        user: userInfo.id,
        articleId: articleInfo.id,
        content: '수정할 게시물 텍스트',
        tags: ['수정할 태그들']
      },
      {
        headers: { authorization: `${accessToken}` }
      }
    ).then(res => {
      console.log(res.data)
    })
  }
  
  const deleteArticle = async () => {
    dispatch(articleDeleteModal(!isArticleDeleteModal));
  }

  // 수정 버튼 온클릭 연결
  const moveToEdit = async () =>{
    navigate(`/editpost?id=${articleInfo.id}`);
  }

  const likeUnlikeHandler = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/likes`,
      {
        user: userInfo.id,
        articleId: articleInfo.id,
        loginMethod: userInfo.loginMethod
      },
      {
        headers: { authorization: `${accessToken}` }
      }
    ).then((res) => {
      dispatch(likeUnlike(res.data.data.totalLikes));
      setLikedOrNot(!likedOrNot);
    })
  }

  const newComment = (e: any) => {
    setComment(e.target.value);
  };

  const createComment = async () => {
    if (isLogin && comment) {
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
        console.log(res.data)
        dispatch(addComment(res.data));
        dispatch(updateTotalComments(res.data.data.totalComments));
        setComment('');
      })
      await axios.get(
        `${process.env.REACT_APP_API_URL}/comments?id=${articleInfo.id}&page=${1}`) // 댓글 추가한 직후는 가장 마지막 렌더링??
        .then(res => {
          dispatch(getComments(res.data.data));
      })
    } else if (isLogin && !comment) {
      alert("내용을 입력해주세요.")
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/logins');
    }
  }

  const updatingComment = (e: any) => {
    setOtherComment(e.target.value);
  };

  const updateComment = async (id: number, comment: any) => {
    setIsUpdatable(true);
    setTargetCommentId(id);
    setTargetComment(comment);
  }

  const saveComment = async (id: number) => {
    // if ()
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/comments`,
      {
        loginMethod: userInfo.loginMethod,
        user: userInfo.id,
        commentId: id,
        comment: otherComment
      },
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      console.log(res.data);
      // dispatch(changeComment(res.data));
      setIsUpdatable(false);
      setTargetCommentId(0);
    })
    await axios.get(
      `${process.env.REACT_APP_API_URL}/comments?id=${articleInfo.id}&page=${1}`)
      .then(res => {
        dispatch(getComments(res.data.data));
    })
  }

  const deleteComment = async (id: number) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/comments?loginMethod=${userInfo.loginMethod}&commentId=${id}&articleId=${articleInfo.id}&user=${userInfo.id}`,
      { 
        headers: {
          authorization: `${accessToken}`
        }
      }
    ).then(res => {
      dispatch(removeComment(id));
      dispatch(updateTotalComments(res.data.data.totalComments));
    }).catch(() => {
      navigate(`/postdetails?id=${articleInfo.id}`);
    })
  }

  return (
    <div className="detail-container">
      <div className="detail-body">
        <div className="detail-nav">
          <div className="writer-info">
            <img className="writer_profile_image" alt="profile_image" src={writerInfo.profileImage} onClick={() => {navigate(`/userinfo?id=${writerInfo.id}`)}} onKeyDown={() => {navigate(`/userinfo?id=${writerInfo.id}`)}}/>
            <div className="nickname_time-box">
              <span className="writer_nickname" onClick={() => {navigate(`/userinfo?id=${writerInfo.id}`)}} onKeyDown={() => {navigate(`/userinfo?id=${writerInfo.id}`)}} role="contentinfo">{writerInfo.nickname}</span>
              <span className="written_time">{`${String(articleInfo.createdAt).slice(0, 10)} ${String(articleInfo.createdAt).slice(11, 16)}`}</span>
            </div>
          </div>
          {
            userInfo.id === writerInfo.id
            ? <div className="article-buttons">
                <button className="post-delete" type="button" onClick={deleteArticle}>삭제</button>
                <button className="post-modify" type="button" onClick={moveToEdit}>수정</button>
              </div>
            : null
          }
        </div>
        <div className="detail-infinite-scroll">
          <div className="post-text">{articleInfo.content}</div>
          <div className="post-tags"> 
            {articleInfo.tags
            ? articleInfo.tags.map((tag: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
              return (
                <div>
                  <span className="each-tags" key={articleInfo.tags.indexOf(tag)} role="search" onClick={() => navigate(`/search?tag=${tag}`)} onKeyDown={() => navigate(`/search?tag=${tag}`)}>#{tag}</span>
                </div>
              )
            }) : null}
          </div>
          <div className="post-comments">
            {commentInfo
            ? commentInfo.map(each => {
              return (
                <li
                  className="comment_list"
                  key={each.id}
                >
                  {/* <div className="comment_info"> */}
                    <img
                      alt="profile_image"
                      src={each.profileImage}
                      className="comment-writer_profile_image" 
                      onClick={() => {navigate(`/userinfo?id=${each.userId}`)}}
                      onKeyDown={() => {navigate(`/userinfo?id=${each.userId}`)}} />
                    <div className="comment-info">
                      <div className="writer-nickname-time-delete-box">
                        <span
                          className="comment-writer-nickname"
                          role="contentinfo"
                          onClick={() => {navigate(`/userinfo?id=${each.userId}`)}}
                          onKeyDown={() => {navigate(`/userinfo?id=${each.userId}`)}}>{each.nickname}
                        </span>
                        <span className="comment-written-time">{`${String(each.createdAt).slice(0, 10)} ${String(each.createdAt).slice(11, 16)}`}</span>
                        {
                          userInfo.id === each.userId
                          ? <div>
                              {/* <FontAwesomeIcon className="comment-modify" icon={faPencil} onClick={() => updateComment(each.id, each.comment)} /> */}
                              <FontAwesomeIcon className="comment-delete" icon={faTrashCan} onClick={() => deleteComment(each.id)} />
                            </div>
                          : null
                        }
                      </div>
                      <div className="comment-text">{each.comment}</div>
                    </div>
                  {/* </div> */}
                </li>
              )
            })
            : <div>No Comments Yet!</div>
          }
          </div>
        </div>
      </div>
      <div className="detail-footer">
        <div className="iconBox">
          {
            likedOrNot
            ? <FontAwesomeIcon className="likeUnlikeIcon" icon={solidHeart} onClick={likeUnlikeHandler} onKeyDown={likeUnlikeHandler} />
            : <FontAwesomeIcon className="likeUnlikeIcon" icon={regularHeart} onClick={likeUnlikeHandler} onKeyDown={likeUnlikeHandler} /> 
          }
          <div className="totallikes">{articleInfo.totalLike}</div>
          <FontAwesomeIcon className="commentIcon" icon={faCommentDots} />
          <div className="totalcomments">{articleInfo.totalComment}</div>
        </div>
        <div className="comment-writing">
          <h3 className="comment-writing-title">댓글쓰기</h3>
          {
            !isUpdatable
            ? <div className="comment-writing-box">
                <input className="writing-box" type="text" value={comment} onChange={newComment}/>
                <button type="submit" className="comment-submit" onClick={createComment}>작성</button>
              </div>
            : <div className="comment-writing-box">
                <input className="writing-box" type="text" value={targetComment} onChange={updatingComment}/>
                <button type="submit" className="comment-update" onClick={() => saveComment(targetCommentId)}>수정</button>
              </div>
          }
        </div>
      </div>
      {isArticleDeleteModal ? <ArticleDeleteModal /> : null}
    </div>
  )
}

export default ContentsDetail;
