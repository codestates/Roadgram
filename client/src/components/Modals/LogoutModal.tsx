import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/AuthSlice';
import auth from '../../store/AuthSlice';
import './_logoutModal.scss';
import { RootState } from '../..';
import { logoutModal, resetModal } from '../../store/ModalSlice';
import { resetFollow } from '../../store/FollowSlice';
import { resetUserInfo } from '../../store/UserInfoSlice';

function LogoutModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogoutModal } = useSelector((state: RootState) => state.modal);
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const closeModal = () => {
    dispatch(logoutModal(!isLogoutModal));
  }

  const handleDeleteUser = async () => {
    try {
      await axios.post(
        `http://localhost:5000/users/logout`,
        {
          loginMethod: userInfo.loginMethod,
          user: userInfo.id
        },
        {
          headers: {
            authorization: `${accessToken}`
          }
        });
        dispatch(logout());
        dispatch(resetFollow());
        dispatch(resetModal());
        dispatch(resetUserInfo());
        // dispatch(logoutModal(!isLogoutModal));
        navigate('/main');
    } catch {
      console.log('logout error');
      dispatch(logoutModal(!isLogoutModal));
    }
  }
  return (
    <div className="withdrawal-center-wrap">
      <div className="withdrawal-background">
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