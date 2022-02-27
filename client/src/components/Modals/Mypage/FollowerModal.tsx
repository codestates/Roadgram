import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../..'
import { getMainArticles } from '../../../store/ArticleSlice'
import { logout, newAccessToken } from '../../../store/AuthSlice'
import { getFollower } from '../../../store/FollowSlice'
import { followerModal } from '../../../store/ModalSlice'
import { update } from '../../../store/UserInfoSlice'
import './_followModal.scss'


function FollowerModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isFollowerModal } = useSelector((state: RootState) => state.modal)
  const { followerList } = useSelector((state: RootState) => state.follow)
  const { id, loginMethod } = useSelector((state: RootState) => state.auth.userInfo);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const closeModal = () => {
    dispatch(followerModal(!isFollowerModal))
  }

  const moveToUserPage = (targetId: any) => {
    dispatch(update({ targetId, userInfo: {}, articles: [] }));
    closeModal();
    navigate(`/userinfo?id=${targetId}`);
  }

  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${id}&loginMethod=${loginMethod}`, { headers: { authorizaion: `${accessToken}` } });
    dispatch(newAccessToken(response.data.data));
  }

  const getFollowerList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
      dispatch(getFollower(response.data.data));
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        try {
          await accessTokenRequest();
        } catch {
          dispatch(followerModal(!isFollowerModal))
          alert('다시 로그인해주세요');
          dispatch(logout());
          navigate('/logins');
        }
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
          dispatch(getFollower(response.data.data));
        } catch {
          dispatch(getFollower([]));
        }
      } else {
        dispatch(getFollower([]));
      }
    }
  }

  useEffect(() => {
    getFollowerList();
  }, [isFollowerModal])

  // async function moveToUserPage(targetId: any) {
  //   closeModal();
  //   const page = 1;
  //   await axios
  //   .get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${id}&page=${page}&other=${targetId}`)
  //   .then((res) => {
  //     dispatch(update(res.data.data)); // userInfo 정보 update
  //     dispatch(getMainArticles(res.data.data.articles))
  //     navigate(`/userinfo?id=${targetId}`);
  //   })
  //   .catch(console.log);
  // }

  return (
    <div className="follow-center-wrap">
      <div className="follow-box">
        <div className="follow-background">
          <span className="follow-title">팔로워</span>
          <button className="close-button" type="button" onClick={closeModal}>&times;</button>
        </div>
        <hr />
        <div className="follows">
          {followerList?.map((each) => {
            return (
              <li
                className="follow_profile_list"
                key={each.id}
                onClick={() => { moveToUserPage(each.id) }}
                onKeyDown={() => { moveToUserPage(each.id) }}
              >
                <img alt="profile_image" src={each.profileImage} className="follow_profile_image" />
                <span>{each.nickname}</span>
              </li>
            )
          })
          }
        </div>
      </div>
    </div>
  )
}

export default FollowerModal;
