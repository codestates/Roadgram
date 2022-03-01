import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../..'
import { getMainArticles } from '../../../store/ArticleSlice'
import { logout, newAccessToken } from '../../../store/AuthSlice'
import { addFollower, getFollower } from '../../../store/FollowSlice'
import { followerModal } from '../../../store/ModalSlice'
import { update } from '../../../store/UserInfoSlice'
import '../../../styles/components/modals/_followModal.scss'


function FollowerModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isFollowerModal } = useSelector((state: RootState) => state.modal)
  const { followerList } = useSelector((state: RootState) => state.follow)
  const { id, loginMethod } = useSelector((state: RootState) => state.auth.userInfo);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const [page, setPage] = useState(2);
  const [end, setEnd] = useState(false);

  // 모달창 종료
  const closeModal = () => {
    dispatch(followerModal(!isFollowerModal))
  }

  // 유저 클릭 시 유저 페이지 이동
  const moveToUserPage = (targetId: any) => {
    dispatch(update({ targetId, userInfo: {}, articles: [] }));
    closeModal();
    navigate(`/userinfo?id=${targetId}`);
  }

  // 액세스 토큰 요청
  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${id}&loginMethod=${loginMethod}`, { headers: { authorizaion: `${accessToken}` } });
    dispatch(newAccessToken(response.data.data));
  }

  // 팔로워 목록 젤 처음에 받아오기
  const getFollowerList = async () => {
    try {
      // 팔로워 목록 요청
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
      dispatch(getFollower(response.data.data)); // 상태 업데이트
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        // 권한 에러 발생시 리프레시 토큰으로 토큰 재발급 요청
        try {
          await accessTokenRequest();
        } catch {
          // 실패시 로그아웃 처리 & 모달창 닫기 & 로그인 페이지로 연결
          dispatch(followerModal(!isFollowerModal))
          alert('다시 로그인해주세요');
          dispatch(logout());
          navigate('/logins');
        }
        // 새 토큰으로 이전 요청 반복
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
          dispatch(getFollower(response.data.data));
        } catch {
          dispatch(getFollower([]));
        }
        // 다른 에러 응답에 대해서는 빈 배열로 업데이트
      } else {
        dispatch(getFollower([]));
      }
    }
  }

  // 페이지 넘어가면서 팔로워 목록 추가
  const addFollowerList = async () => {
    try {
      // api 요청
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${page}`, { headers: { authorization: `${accessToken}` } });
      dispatch(addFollower(response.data.data)); // 팔로워 목록에 추가
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        // 권한 오류 시 토큰 재발급 요청
        try {
          await accessTokenRequest();
        } catch {
          // 실패시 로그아웃 처리
          setEnd(true)
          dispatch(followerModal(!isFollowerModal))
          alert('다시 로그인해주세요');
          dispatch(logout());
          navigate('/logins');
        }
        // 이전 요청 반복
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/follow/follower?user=${id}&loginMethod=${loginMethod}&page=${1}`, { headers: { authorization: `${accessToken}` } });
          dispatch(addFollower(response.data.data));
        } catch {
          setEnd(true);
        }
        // 다른 에러 응답에 대해선 일괄적으로 더이상 목록 추가 안되게 변경
      } else {
        setEnd(true);
      }
    }
  }

  // 스크롤 발생시 콜백함수
  const handleScroll = useCallback((): void => {
    const { clientHeight } = document.getElementsByClassName('follows')[0];// 팔로우 모달창 높이
    const { scrollHeight } = document.getElementsByClassName('follows')[0];// 총 스크롤 길이
    const { scrollTop } = document.getElementsByClassName('follows')[0];// 스크롤 현 위치
    // 팔로우 모달창 길이와 스크롤 현위치를 더해서 총 스크롤 길이가 되면 다음 데이터 호출
    if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
      addFollowerList();
      setPage(page + 1)
    }
  }, [page]);
  
  // 처음 랜더링 시 데이터 받아오기& 상태 초기화
  useEffect(() => {
    getFollowerList();
    setPage(2);
    setEnd(false);
  }, [isFollowerModal])

  // 스크롤 이벤트 추가
  useEffect(() => {
    if (!end) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    }
  }, [handleScroll])

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
