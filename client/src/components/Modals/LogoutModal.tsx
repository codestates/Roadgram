import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/AuthSlice';
import './_logoutModal.scss';
import { RootState } from '../..';

function LogoutModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await axios.post(
        `http://localhost:5000/users/logout`,
        {
          loginMethod: 0,
          user: userInfo.id
        },
        {
          headers: {
            authorization: `${accessToken}`
          }
        }).then(() => {
          
          dispatch(logout());
        }).then(() => {
          navigate('/main');
        })
    } catch {
      console.log('logout error');
      
    }
  };


  return (
    <div className="logout-center-wrap">
      <div className="logout-background">
        <div className="logout-box">
          <div className="logout-msg">로그아웃하시겠습니까?</div>
          <button className="yesorno" type="button" onClick={handleLogout}>네</button>
          <button className="yesorno" type="button">아니오</button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal;