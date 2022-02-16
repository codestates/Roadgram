import React from 'react';
import '../style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo.png';

function Navigator() {
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
        <div className="login-button">로그인</div>
      </div>
    </div>
  );
}
export default Navigator;
