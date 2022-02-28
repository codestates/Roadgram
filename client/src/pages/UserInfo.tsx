import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '..';
import Article from '../components/Article';
import FollowerModal from '../components/Modals/Mypage/FollowerModal';
import FollowingModal from '../components/Modals/Mypage/FollowingModal';
import { addMainArticles, getMainArticles } from '../store/ArticleSlice';
import { getFollower, getFollowing } from '../store/FollowSlice';
import { followerModal, followingModal } from '../store/ModalSlice';
import { update } from '../store/UserInfoSlice';
import MainPage from './MainPage';

function UserInfo() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 로그인한 유저 ID
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const state = useSelector((state: RootState) => state);
  const { id, loginMethod } = useSelector((state: RootState) => state.auth.userInfo);
  const { targetId, userInfo, articles } = useSelector((state: RootState) => state.userInfo);
  const [isFollow, setIsFollow] = useState(false);
  const { mainArticles } = useSelector((state: RootState) => state.articles);
  const [target, setTarget] = useState(0);
  const [totalFollower, setTotalFollower] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);

  const [page,setPage]=useState(2);
  const [endScroll,setEndScroll]=useState(false);

  // 팔로잉, 팔로워 모달 on/off
  const { isFollowingModal, isFollowerModal } = useSelector((state: RootState) => state.modal);
  // 최초 렌더링 시 getMypageInfo 실행 effect
  useEffect(() => {
    const url = new URL(window.location.href);
    const id: string | null = url.searchParams.get('id');
    getMyPageInfo(Number(id));
    setEndScroll(false);
    setPage(2); // 새로 렌더링 시 페이지와 스크롤 상태 초기화
  }, [targetId])

  // isFollow 변경 시 값 확인 렌더링
  useEffect(() => {
    console.log(`isFollow는 ${isFollow}입니다.`);
  }, [isFollow])

  // 모달창 띄울 시 주변 스크롤 방지
  useEffect(() => {
    if (isFollowerModal || isFollowingModal) {
      document.documentElement.style.cssText = `
      position:fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width:100%;
      `;
    }
    return () => {
      document.documentElement.style.cssText = '';
    }
  }, [isFollowerModal, isFollowingModal])


  const getMyPageInfo = async (targetId: number) => {
    // setUsericonCLick(!usericonClick)
    console.log("getMyPageInfo 실행")
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${id}&page=${1}&other=${targetId}`)
    // userInfo 정보 update
    dispatch(update(res.data.data));
    // 뿌려줄 articles 정보 update
    dispatch(getMainArticles(res.data.data.articles));
    // totalFollwer state update
    setTotalFollower(res.data.data.userInfo.totalFollower);
    // totalFollwing state update
    setTotalFollowing(res.data.data.userInfo.totalFollowing);
    // follow 여부 update
    setIsFollow(res.data.data.userInfo.followedOrNot);
    if(!res.data.data.articles.length){
      setEndScroll(true);
    }
  }
  
  // 스크롤 시 게시물 서버에 요청하는 함수
  const addArticle=async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${id}&page=${page}&other=${targetId}`);
    dispatch(addMainArticles(res.data.data.articles));// 게시물만 추가
    if(!res.data.data.articles.length){
      setEndScroll(true);
    }
  }

   // 스크롤 발생시 콜백함수
   const handleScroll = useCallback((): void => {
    const { innerHeight }= window// 팔로우 모달창 높이
    const { scrollHeight } = document.documentElement;// 총 스크롤 길이
    const { scrollTop } = document.documentElement;// 스크롤 현 위치
    // 팔로우 모달창 길이와 스크롤 현위치를 더해서 총 스크롤 길이가 되면 다음 데이터 호출
    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      addArticle();
      setPage(page + 1)
    }
  }, [page]);

  // 스크롤 시 새로 렌더링해 실행될 함수
  useEffect(() => {
    if (!endScroll) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    }
  }, [handleScroll])

  function moveToEditProfile() {
    navigate('/editprofile')
  }

  const openFollowingModal = async () => {
    // const page = 1;
    // await axios
    // .get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${loginMethod}&page=${page}`, {headers: {authorization: `${accessToken}`}})
    // .then((res) => {
    //   if(res.data.statusCode === 204) {
    //     dispatch(getFollowing([]))
    //   } else {
    //     dispatch(getFollowing(res.data.data))
    //   }
    dispatch(followingModal(!isFollowingModal));
    // })
    // .catch(console.log);  

  };

  const openFollowerModal = async () => {
    // const page = 1;
    // await axios
    // .get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${page}`, {headers: {authorization: `${accessToken}`}})
    // .then((res) => {
    //   if(res.data.statusCode === 204) {
    //     dispatch(getFollower([]))
    //   } else {
    //     dispatch(getFollower(res.data.data))
    //   }
    dispatch(followerModal(!isFollowerModal));
    // })
    // .catch((err) => {
    //   console.log(err)
    // });
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
          <img src={userInfo.profileImage} className="userinfo_image_img" alt="profile_image" />
        </div>
        <div className="userinfo_profile_div">
          <div className="userinfo_nickname_div">
            <span>{userInfo.nickname}</span>
            {id !== userInfo.id
              ? <button type="button" onClick={followingOrCacnel} >{isFollow === true && isFollow ? "팔로우 해제" : "팔로우"}</button>
              : <button type="button" onClick={moveToEditProfile}>프로필수정</button>}
          </div>
          <div className="userinfo_status_div">
            <span>{userInfo.statusMessage}</span>
          </div>
          <div className="userinfo_inform_div">
            <div className="userinfo_inform_list">
              <div>게시물</div>
              <div>{articles.length}</div>
            </div>
            {id !== userInfo.id ? (
              <div className="userinfo_inform_list">
                <div> 팔로잉</div>
                <div>{totalFollowing}</div>
              </div>) : (
              <label className='owner' htmlFor='following'>
                <div className="userinfo_inform_list" >
                  <div>팔로잉</div>
                  <div>{totalFollowing}</div>
                </div>
              </label>
            )}
            {id !== userInfo.id ? (
              <div className="userinfo_inform_list">
                <div > 팔로워</div>
                <div>{totalFollower}</div>
              </div>
            ) : (
              <label className='owner' htmlFor='follower'>
                <div className="userinfo_inform_list" >
                  <div>팔로워</div>
                  <div>{totalFollower}</div>
                </div>
              </label>
            )}
            <button id='following' type='button' className='hidden' onClick={openFollowingModal} onKeyDown={openFollowingModal}>123</button>
            <button id='follower' type='button' className='hidden' onClick={openFollowerModal} onKeyDown={openFollowerModal}>123</button>
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
        : (
          <div className='userinfo_article_div'>
            <Article />
          </div>)
      }
    </div>
  )
}

export default UserInfo
