import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import FollowerModal from '../components/Modals/Mypage/FollowerModal';
import FollowingModal from '../components/Modals/Mypage/FollowingModal';
import logo from '../images/logo.png'
import { getFollower, getFollowing } from '../store/FollowSlice';
import { followerModal, followingModal } from '../store/ModalSlice';

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 로그인한 유저 ID
  const {accessToken} = useSelector((state: RootState) => state.auth); 
  const state = useSelector((state: RootState) => state); 
  const {id, loginMethod} = useSelector((state: RootState) => state.auth.userInfo); 
  // 뿌려줄 유저 정보
  const {userInfo, articles} = useSelector((state: RootState) => state.userInfo); 
  // 팔로잉, 팔로워 모달 on/off
  const { isFollowingModal, isFollowerModal } = useSelector((state: RootState) => state.modal);

  console.log("state 확인!===", state);
  function moveToEditProfile() {
    alert("프로필 수정 서비스는 제작 중입니다.");
  }

  const openFollowingModal = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${0}&page=${1}`, {headers: {authorization: `${accessToken}`}})
    .then((res) => {
      dispatch(getFollowing(res.data.data))
      dispatch(followingModal(!isFollowingModal));
    })
    .catch(console.log);  
    
  };

  const openFollowerModal = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${0}&page=${1}`, {headers: {authorization: `${accessToken}`}})
    .then((res) => {
      dispatch(getFollower(res.data.data))
      dispatch(followerModal(!isFollowerModal));
    })
    .catch(console.log);
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
          ? <button type="button">팔로우</button>
          : <button type="button" onClick={moveToEditProfile}>프로필수정</button>}
        </div>
        <div className="userinfo_inform_div">
          <div> 게시물
            <span>{articles.length}</span>
          </div>
          {id !== userInfo.id
          ? 
            <>
              <li className="other"> 팔로잉
                <span >{userInfo.totalFollowing}</span>
              </li>
              <li className="other"> 팔로워
                <span >{userInfo.totalFollower}</span>
              </li>
              </>
          : <>
              <li className="owner" onClick={openFollowingModal} onKeyDown={openFollowingModal}> 팔로잉
                <span>{userInfo.totalFollowing}</span>
              </li>
              <li className="owner" onClick={openFollowerModal} onKeyDown={openFollowerModal}> 팔로워
                <span>{userInfo.totalFollower}</span>
              </li>
            </>
            }
          
          
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
