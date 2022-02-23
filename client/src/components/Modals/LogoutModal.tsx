import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import auth from '../../store/AuthSlice';
import './_logoutModal.scss';
import { RootState } from '../..';
import { logoutModal } from '../../store/ModalSlice';

function LogoutModal() {
  const dispatch = useDispatch();
  const { isLogoutModal } = useSelector((state: RootState) => state.modal);

  const closeModal = () => {
    dispatch(logoutModal(!isLogoutModal));
  }

  const handleDeleteUser = async () => {
    try {
      await axios.post(
        `http://localhost:5000/users/logout`,
        {
          loginMethod: 0,
          user: 11
        },
        {
          headers: {
            authorization: ''
          }
        });
        dispatch(logout());
        window.location.replace('/');
    } catch {
      console.log('logout error');
    }
  }
  return (
    <div className="withdrawal-center-wrap">
      <div className="withdrawal-background" onClick={closeModal}>
        <div className="withdrawal-box">
          <div className="withdrawal-msg">로그아웃하시겠습니까?</div>
          <button className="yesorno" type="button" onClick={handleDeleteUser}>네</button>
          <button className="yesorno" type="button">아니오</button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal;
