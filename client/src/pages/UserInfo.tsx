import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '..';
import Article from '../components/Article';
import FollowerModal from '../components/Modals/Mypage/FollowerModal';
import FollowingModal from '../components/Modals/Mypage/FollowingModal';
import { getMainArticles } from '../store/ArticleSlice';
import { getFollower, getFollowing } from '../store/FollowSlice';
import { followerModal, followingModal } from '../store/ModalSlice';
import { update } from '../store/UserInfoSlice';
import MainPage from './MainPage';

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 로그인한 유저 ID
  const {accessToken} = useSelector((state: RootState) => state.auth); 
  const state = useSelector((state: RootState) => state); 
  const {id, loginMethod} = useSelector((state: RootState) => state.auth.userInfo); 
  const {targetId, userInfo, articles} = useSelector((state: RootState) => state.userInfo); 
  const [isFollow, setIsFollow] = useState(false);
  const { mainArticles } = useSelector((state: RootState) => state.articles);
  const [target, setTarget] = useState(0);
  const [totalFollower, setTotalFollower] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);
  // 팔로잉, 팔로워 모달 on/off
  const { isFollowingModal, isFollowerModal } = useSelector((state: RootState) => state.modal);
  
  // 최초 렌더링 시 getMypageInfo 실행 effect
  useEffect(() => {
    // dispatch(getMainArticles(articles));
    const url = new URL(window.location.href);
    const id: string | null = url.searchParams.get('id');
    getMyPageInfo(Number(id));
    console.log("state===", state);
  },[targetId])

  // isFollow 변경 시 값 확인 렌더링
  useEffect(() => {
    console.log(`isFollow는 ${isFollow}입니다.`);
  },[isFollow])

  const getMyPageInfo = async (targetId: number) => {
    // setUsericonCLick(!usericonClick)
    const page = 1
    console.log("getMyPageInfo 실행")
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${id}&page=${page}&other=${targetId}`)
      .then(res => {
        // userInfo 정보 update
        dispatch(update(res.data.data)) 
        // 뿌려줄 articles 정보 update
        dispatch(getMainArticles(res.data.data.articles))
        // totalFollwer state update
        setTotalFollower(res.data.data.userInfo.totalFollower);
        // totalFollwing state update
        setTotalFollowing(res.data.data.userInfo.totalFollowing);
        // follow 여부 update
        setIsFollow(res.data.data.userInfo.followedOrNot);
      })
      .catch(console.log)
  }

  function moveToEditProfile() {
    navigate('/editprofile')
  }

  const openFollowingModal = async () => {
    const page = 1;
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${loginMethod}&page=${page}`, {headers: {authorization: `${accessToken}`}})
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
    const page = 1;
    await axios
    .get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${page}`, {headers: {authorization: `${accessToken}`}})
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
        headers: { authorization: `${accessToken}` }
      })
    .then((res) => {
      // total Follower update
      setTotalFollower(res.data.data.totalFollower);
      // follow 여부 update
      setIsFollow(!isFollow);
    })
    .catch(console.log);
  }

  console.log(`useEffect밖:::::isFollow는 ${isFollow}입니다.`);
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
            ? <button type="button" onClick={followingOrCacnel} >{isFollow === true && isFollow ? "팔로우 해제" : "팔로우"}</button>
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
                  <span >{totalFollowing}</span>
                </li>
                <li className="other"> 팔로워
                  <span >{totalFollower}</span>
                </li>
                </>
            : <>
                <li className="owner" onClick={openFollowingModal} onKeyDown={openFollowingModal}> 팔로잉
                  <span>{totalFollowing}</span>
                </li>
                <li className="owner" onClick={openFollowerModal} onKeyDown={openFollowerModal}> 팔로워
                  <span>{totalFollower}</span>
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
      {mainArticles.length === 0 || !mainArticles 
      ? <div className="no_following_post">작성된 게시글이 없습니다.
          <Link to="/createpost" style={{ textDecoration: 'none' }}>
            <button type="button" className={id !== userInfo.id ? "hidden" : ""}>작성하기</button>
          </Link>
        </div>
      : <Article/>
      }
    </div>
    )
}

export default UserInfo
