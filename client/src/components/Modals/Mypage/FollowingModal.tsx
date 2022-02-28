import axios from 'axios'
import e from 'express'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../..'
import { getMainArticles } from '../../../store/ArticleSlice'
import { logout, newAccessToken } from '../../../store/AuthSlice'
import { getFollower, getFollowing } from '../../../store/FollowSlice'
// import { followings } from '../../../store/FollowSlice'
import { followingModal } from '../../../store/ModalSlice'
import { update } from '../../../store/UserInfoSlice'
import './_followModal.scss'

function FollowingModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isFollowingModal } = useSelector((state: RootState) => state.modal)
  const { followingList } = useSelector((state: RootState) => state.follow)
  // const { id, nickname, profileImage } = useSelector((state: RootState) => state.follow)
  const { id, loginMethod } = useSelector((state: RootState) => state.auth.userInfo);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  // const observerRef = useRef()

  const closeModal = () => {
    dispatch(followingModal(!isFollowingModal))
  }

  const getFollowingList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
      dispatch(getFollowing(response.data.data));
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        try {
          await accessTokenRequest();
        } catch {
          dispatch(followingModal(!isFollowingModal))
          alert('다시 로그인해주세요');
          dispatch(logout());
          navigate('/logins');
        }
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/following?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
          dispatch(getFollowing(response.data.data));
        } catch {
          dispatch(getFollowing([]));
        }
      }
      else {
        dispatch(getFollowing([]));
      }
    }
  }

  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${id}&loginMethod=${loginMethod}`, { headers: { authorizaion: `${accessToken}` } });
    dispatch(newAccessToken(response.data.data));
  }

  useEffect(() => {
    getFollowingList();
  }, [isFollowingModal])

  // const [target, setTarget] = useState(null)

  // // IntersectionObserver 생성
  // const options = {
  //   root: null,
  //   rootMargin: '10px',
  //   threshold: 1.0
  // };

  // useEffect(() => {
  //   console.log(followingList);
  // }, [followingList]);

  // const getMoreList = async () => {
  //   await axios
  //   .get(`${process.env.REACT_APP_API_URL}/follow/following?user=${userInfo.id}&loginMethod=${0}&page=${2}`, {headers: {authorization: `${accessToken}`}})
  //   .then((res) => {
  //     dispatch(getFollower(res.data.data));
  //   })
  //   .catch(console.log);
  // setFollowingLists((itemLists) => itemLists.concat(Items));
  // };

  // const onIntersect = async ([entry], observer) => {
  //   if (entry.isIntersecting) {
  //     observer.unobserve(entry.target);
  //     await getMoreList();
  //     observer.observe(entry.target);
  //   }
  // };

  // useEffect(() => {
  //   let observer;
  //   if (target) {
  //     observer = new IntersectionObserver(onIntersect, {
  //       threshold: 0.4,
  //     });
  //     observer.observe(target);
  //   }
  //   return () => observer && observer.disconnect();
  // }, [target]);

  const moveToUserPage = (targetId: any) => {
    dispatch(update({ targetId, userInfo: {}, articles: [] }));
    closeModal();
    navigate(`/userinfo?id=${targetId}`);
  }

  return (
    <div className="follow-center-wrap">
      <div className="follow-box">
        <div className="follow-background">
          <span className="follow-title">팔로잉</span>
          <button className="close-button" type="button" onClick={closeModal}>
            &times;
          </button>
        </div>
        <hr />
        <div className="follows">
          {followingList
            ? followingList.map(each => {
              return (
                <li
                  className="follow_profile_list"
                  key={each.id}
                  onClick={() => {
                    moveToUserPage(each.id)
                  }}
                  onKeyDown={() => {
                    moveToUserPage(each.id)
                  }}
                >
                  <img alt="profile_image" src={each.profileImage} className="follow_profile_image" />
                  <span>{each.nickname}</span>
                </li>
              )
            })
            : <div>1</div>
          }
        </div>
      </div>
    </div>
  )
}

export default FollowingModal
