import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../..';
import { logout, newAccessToken } from '../../store/AuthSlice';
import { withdrawalModal } from '../../store/ModalSlice';
import './_withdrawalModal.scss';

function WithdrawalModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isWithdrawalModal } = useSelector((state: RootState) => state.modal);
  const { isLogin, userInfo, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

  // 액세스토큰 재 요청하는 함수
  const accessTokenRequest = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL}/users/auth?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
      {
        headers: { authorization: `${refreshToken}` }
      });
    // 액세스 토큰 업데이트
    dispatch(newAccessToken(res.data.data));
  }
  
  // 리프레시 토큰 로직 추가
  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/withdrawal?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
        {
          headers: {
            authorization: `${accessToken}`
          }
        })
      closeModal();
      dispatch(logout());
      navigate('/'); // 성공 시 랜딩페이지로 이동
    } catch {
      // 실패시 새로 액세스토큰 발급 요청
      try {
        accessTokenRequest();
      } catch {
        alert('다시 로그인해 주세요.');
        closeModal();
        dispatch(logout());
        navigate('/logins');// 리프레시 토큰도 만료 시 로그인 페이지로 연결
      }
      // 받아온 토큰으로 다시 요청
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API_URL}/users/withdrawal?user=${userInfo.id}&loginMethod=${userInfo.loginMethod}`,
          {
            headers: {
              authorization: `${accessToken}`
            }
          })
        closeModal();
        dispatch(logout());
        navigate('/');
      } catch (err: any) {
        closeModal();
        dispatch(logout());// 다시 해도 실패 시 그냥 로그아웃 처리만
        console.log(err);
      }
    }
  };

  const closeModal = () => {
    dispatch(withdrawalModal(!isWithdrawalModal));
  };

  return (
    <div className="withdrawal-center-wrap">
      <div className="withdrawal-background">
        <div className="withdrawal-box">
          <div className="withdrawal-msg">정말 탈퇴하시겠습니까?</div>
          <button className="yesorno" type="button" onClick={handleDeleteUser}>네</button>
          <button className="yesorno" type="button" onClick={closeModal}>아니오</button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalModal;
