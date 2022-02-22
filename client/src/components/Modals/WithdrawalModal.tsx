import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { closeModal } from '../../store/ModalSlice';
import WithdrawalDoneModal from './Mypage/WithdrawalDoneModal';
import './_withdrawalModal.scss';

function WithdrawalModal() {
  const dispatch = useDispatch();

  const handleDeleteUser = async () => {
    try {
      dispatch(logout());
      await axios.delete(
        `http://`,
        {
          headers: {
            authorization: ''
          }
        });
        window.location.replace('/');
    } catch {
      console.log('withdrawal error');
    }
  }

  return (
    <div className="withdrawal-center-wrap">
      <div className="withdrawal-background">
        <div className="withdrawal-box">
          <div className="withdrawal-msg">정말 탈퇴하시겠습니까?</div>
          <button className="yesorno" type="button" onClick={handleDeleteUser}>네</button>
          <button className="yesorno" type="button">아니오</button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalModal;
