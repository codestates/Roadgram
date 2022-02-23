import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import FollowerModal from '../components/Modals/Mypage/FollowerModal';
import FollowingModal from '../components/Modals/Mypage/FollowingModal';
import logo from '../images/logo.png'
import { followerModal, followingModal } from '../store/ModalSlice';

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

  const { isFollowingModal, isFollowerModal } = useSelector((state: RootState) => state.modal);
  const openFollowingModal = () => {
    dispatch(followingModal(!isFollowingModal));

    // 요청문과 상태 업데이트
  };

  const openFollowerModal = () => {
    dispatch(followerModal(!isFollowerModal));

    // 요청문과 상태 업데이트
  };

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
          <li onClick={openFollowingModal} onKeyDown={openFollowingModal}> 팔로우
            <span>{userInfo.totalFollowing}</span>
          </li>
          <li onClick={openFollowerModal} onKeyDown={openFollowerModal}> 팔로워
            <span>{userInfo.totalFollower}</span>
          </li>
        </div>
        <div className="userinfo_status_div">
          <span>{userInfo.statusMessage}</span>
        </div>
      </div>
      {isFollowingModal ? <FollowingModal /> : null}
      {isFollowerModal ? <FollowerModal /> : null}
    </div>
    )
}

export default UserInfo
