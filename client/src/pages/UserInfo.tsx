import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '..';
import FollowerModal from '../components/Modals/Mypage/FollowerModal';
import FollowingModal from '../components/Modals/Mypage/FollowingModal';
import { getMainArticles } from '../store/ArticleSlice';
import { getFollower, getFollowing } from '../store/FollowSlice';
import { followerModal, followingModal } from '../store/ModalSlice';
import MainPage from './MainPage';

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 로그인한 유저 ID
  const {accessToken} = useSelector((state: RootState) => state.auth); 
  const state = useSelector((state: RootState) => state); 
  const {id, loginMethod} = useSelector((state: RootState) => state.auth.userInfo); 
  const {userInfo, articles} = useSelector((state: RootState) => state.userInfo); 
  const [isFollow, setIsFollow] = useState(userInfo.followedOrNot);
  // 팔로잉, 팔로워 모달 on/off
  const { isFollowingModal, isFollowerModal } = useSelector((state: RootState) => state.modal);
  
  useEffect(() => {
    dispatch(getMainArticles(articles));
  },[articles])

  function moveToEditProfile() {
    navigate('/editprofile')
  }

  const openFollowingModal = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${0}&page=${1}`, {headers: {authorization: `${accessToken}`}})
    .then((res) => {
      if(res.data.statusCode === 204) {
        dispatch(getFollowing([]))
      } else {
        dispatch(getFollowing(res.data.data))
      }
      dispatch(followingModal(!isFollowingModal));
    })
    .catch(console.log);  
    
  };

  const openFollowerModal = async () => {
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${0}&page=${1}`, {headers: {authorization: `${accessToken}`}})
    .then((res) => {
      if(res.data.statusCode === 204) {
        dispatch(getFollower([]))
      } else {
        dispatch(getFollower(res.data.data))
      }
      dispatch(followerModal(!isFollowerModal));
    })
    .catch((err) => {
      console.log(err)
    });
  };
  
  const followingOrCacnel = async () => {
    // 서버 요청
    await axios
    .post(`${process.env.REACT_APP_API_URL}/follow`, 
    {
      user: id, followingUserId: userInfo.id, loginMethod
    },
    { 
      headers: 
      {
        authorization: `${accessToken}`
      }
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch(console.log);

    // state값 변경
    setIsFollow(!isFollow);
  }

  return (
    <div className="userInfo_div">
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
            ? <button type="button" onClick={followingOrCacnel} >{`${isFollow ? "팔로우 해제" : "팔로우"}`}</button>
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
      <MainPage/>
    </div>
    )
}

export default UserInfo
