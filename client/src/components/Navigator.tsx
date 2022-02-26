import React, { useRef, useState } from 'react'
import '../style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faPencil } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { resetUserInfo, update } from '../store/UserInfoSlice'
import logo from '../images/logo.png'
import { RootState } from '../index'
import { logout } from '../store/AuthSlice'
import { resetFollow } from '../store/FollowSlice'
import { resetModal } from '../store/ModalSlice'
import { getMainArticles, setTag } from '../store/ArticleSlice'

function Navigator() {
  const [usericonClick, setUsericonCLick] = useState(false)
  const { isLogin, userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const { tag } = useSelector((state: RootState) => state.articles);
  const [word, setWord] = useState("");
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/logout`,
          {
            loginMethod: userInfo.loginMethod,
            user: userInfo.id,
          },
          {
            headers: {
              authorization: `${accessToken}`,
            },
          },
        )
        .then(() => {
          dispatch(logout())
          dispatch(resetFollow())
          dispatch(resetModal())
          dispatch(resetUserInfo())
          setUsericonCLick(!usericonClick)
        })
    } catch {
      // 테스트를 위해 로그아웃 강제 처리
      dispatch(logout())
      dispatch(resetFollow())
      dispatch(resetModal())
      dispatch(resetUserInfo())
      setUsericonCLick(!usericonClick)
      console.log('logout error')
    }
  }

  const convertToTag = (e: any) => {
    dispatch(setTag(word));
    setWord("");
  }

  const changeWordOfState = (e: any) => {
    setWord(e.target.value);
  }

  const updateTargetId = () => {
    dispatch(update({targetId: userInfo.id, userInfo: {}, articles: []}));
    setUsericonCLick(!usericonClick);
  }

  return (
    <div id="navigator-container">
      <div className="structure" />
      <div className="structure">
        <Link to="/main" style={{ textDecoration: 'none' }}>
          <img className="logo" alt="logoImg" src={logo} />
        </Link>
      </div>
      <div className="structure sideMenu">
        <div className="inputDiv">
          <input className="searchBar" type="text" placeholder="검색어를 입력하세요." onChange={changeWordOfState} value={word}/>
          <Link to={`/search?tag=${word}`} style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" type="submit" onClick={convertToTag}/>
          </Link>
        </div>
      {isLogin 
      ? <div>
          <Link to="/settingroute" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
            <FontAwesomeIcon icon={faPencil} className="pencilIcon" />
          </Link>
          {/* <Link to="/mypage" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}> */}
          <FontAwesomeIcon icon={faUser} className="userIcon" onClick={() => setUsericonCLick(!usericonClick)} />
          {/* </Link> */}
        </div>
      : <Link to="/logins" style={{ textDecoration: 'none' }}>
          <div className="login-button">로그인</div>
        </Link>
      }
      </div>
      {
      usericonClick 
      ? (
        <div className="hiddenMenu">
          <Link to={`/userinfo?id=${userInfo.id}`} style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
            <li 
            className="mypageMenu" 
            onClick={updateTargetId}
            onKeyDown={updateTargetId}>
              마이페이지
            </li>
          </Link>
          <Link to="/main" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }} onClick={handleLogout}>
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
