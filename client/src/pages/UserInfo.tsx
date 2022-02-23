import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import logo from '../images/logo.png'

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 로그인한 유저 ID
  const {id} = useSelector((state: RootState) => state.auth.userInfo); 
  // 뿌려줄 유저 정보
  const {userInfo, articles} = useSelector((state: RootState) => state.userInfo); 
  function moveToEditProfile() {
    alert("프로필 수정 서비스는 제작 중입니다.");
  }

  return (
    <div className="userinfo_whole_div">
      <div className="userinfo_image_div">
        {userInfo.profileImage
        ? <img src={userInfo.profileImage} className="userinfo_image_img" alt="profile_image"/>
        : <div><button type="button" onClick={moveToEditProfile}>사진추가</button></div>}
        
      </div>
      <div className="userinfo_profile_div">
        <div className="userinfo_nickname_div">
          <span>{userInfo.nickname}</span>
          {id !== userInfo.id
          ? null
          : <button type="button" onClick={moveToEditProfile}>프로필수정</button>}
        </div>
        <div className="userinfo_inform_div">
          <div> 게시물
            <span>{articles.length}</span>
          </div>
          <div> 팔로우
            <span>{userInfo.totalFollowing}</span>
          </div>
          <div> 팔로워
            <span>{userInfo.totalFollower}</span>
          </div>
        </div>
        <div className="userinfo_status_div">
          <span>{userInfo.statusMessage}</span>
        </div>
      </div>
    </div>
    )
}

export default UserInfo
