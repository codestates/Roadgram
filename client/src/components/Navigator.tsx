import React from 'react'
import '../style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { update } from '../store/UserInfoSlice'
import logo from '../images/logo.png'



function Navigator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function MoveToUserInfo() {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${5}&page=${1}`)
    .then((res) => {
      console.log(res.data);
      dispatch(update(res.data.data));
      navigate('/userinfo');
    })
    .catch(console.log);
  }
  return (
    <div className="box navigator">
      <div className="structure" />
      <div className="structure">
        <div className="logo-box">
          <img className="logo" alt="logoImg" src={logo} />
        </div>
      </div>
      <div className="sideMenu structure">
        <div className="inputDiv">
          <input className="searchBar" type="text" placeholder="검색어를 입력하세요." />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
        </div>
        <button type="button" className="login-button" onClick={MoveToUserInfo}>로그인</button>
      </div>
    </div>
  )
}
export default Navigator
