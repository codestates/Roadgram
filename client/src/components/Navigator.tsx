import React, { useState } from 'react'
import '../style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faPencil } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { update } from '../store/UserInfoSlice'
import logo from '../images/logo.png'
import { RootState } from '../index'
import { logout } from '../store/AuthSlice'



function Navigator() {
  const [usericonClick, setUsericonCLick] = useState(false)
  const { isLogin } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }
  return (
    <div id="navigator-container">
      <div className="structure" />
      <div className="structure">
        <Link to="/main" style={{ textDecoration: 'none' }}>
          <img className="logo" alt="logoImg" src={logo} />
        </Link>
      </div>
      {isLogin ? (
        <div className="structure sideMenu">
          <div className="inputDiv">
            <input className="searchBar" type="search" placeholder="검색어를 입력하세요." />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
          </div>
          <div>
            <Link to="/settingroute" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
              <FontAwesomeIcon icon={faPencil} className="pencilIcon" />
            </Link>
            {/* <Link to="/mypage" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}> */}
            <FontAwesomeIcon icon={faUser} className="userIcon" onClick={() => setUsericonCLick(!usericonClick)} />
            {/* </Link> */}
          </div>
        </div>
      ) : (
        <div className="structure sideMenu">
          <div className="inputDiv">
            <input className="searchBar" type="text" placeholder="검색어를 입력하세요." />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
          </div>
          <Link to="/logins" style={{ textDecoration: 'none' }}>
            <div className="login-button">로그인</div>
          </Link>
        </div>
      )}
      {usericonClick ? (
        <div className="hiddenMenu">
          <Link to="/mypage" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
            <div className="mypageMenu">마이페이지</div>
          </Link>
          <Link to="/main" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }} onClick={logoutHandler}>
            <div className="logoutMenu">로그아웃</div>
          </Link>
        </div>
      ) : (
        <div className="hiddenMenu">
          {/* <div className="mypageMenu">마이페이지</div>
          <div className="logoutMenu">로그아웃</div> */}
        </div>
      )}
    </div>
  )
}
export default Navigator
