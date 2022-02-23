import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../..';
import { logout } from '../../store/AuthSlice';
import { withdrawalModal } from '../../store/ModalSlice';
import './_withdrawalModal.scss';

function WithdrawalModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isWithdrawalModal } = useSelector((state: RootState) => state.modal);
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);

  const handleDeleteUser = async () => {
    try {
      dispatch(logout());
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/withdrawal?user=${userInfo.id}&loginMethod=${0}`,
        {
          headers: {
            authorization: `${accessToken}`
          }
        }).then(() => {
          navigate('/');
        });
    } catch {
      console.log('withdrawal error');
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
};

export default WithdrawalModal;
