import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../..';
import { articleDeleteModal } from '../../store/ModalSlice';
import './_withdrawalModal.scss';

function PostDeleteCheckModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isArticleDeleteModal } = useSelector((state: RootState) => state.modal);
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
 const { targetId, writerInfo, articleInfo } = useSelector((state: RootState) => state.articleDetails);


  // 삭제 버튼 클릭 시 실행
  const deleteArticle = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/articles?id=${articleInfo.id}&user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
      {
        headers: { authorization: `${accessToken}`}
      }
    ).then(res => {
      console.log(res.data)
    })
  }

  
  const handleDeleteArticle = async () => {
    try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/articles?id=${articleInfo.id}&user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
          {
            headers: { authorization: `${accessToken}`}
          }
        ).then(res => {
          console.log(res.data);
          closeModal();
          navigate(`/userinfo?id=${userInfo.id}`);
        })
    } catch {
        console.log('failed to delete this post');
    }
  };

  const closeModal = () => {
    dispatch(articleDeleteModal(!isArticleDeleteModal));
  };

  return (
    <div className="withdrawal-center-wrap">
      <div className="withdrawal-background">
        <div className="withdrawal-box">
          <div className="withdrawal-msg">정말 삭제하시겠습니까?</div>
          <button className="yesorno" type="button" onClick={handleDeleteArticle}>네</button>
          <button className="yesorno" type="button" onClick={closeModal}>아니오</button>
        </div>
      </div>
    </div>
  )
}

export default PostDeleteCheckModal;
