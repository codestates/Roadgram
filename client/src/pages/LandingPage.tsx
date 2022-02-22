import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/AuthSlice';

function LandingPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector((state) => state);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const url = new URL(window.location.href)
      const authorizationCode = url.searchParams.get('code')
      // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
      // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
      if (authorizationCode) {
          getAccessToken(authorizationCode)
      }
    } else {
      console.log("state ===", state);
    }
  },[state])

  async function getAccessToken(code: string) {
    await axios
    .post(`${process.env.REACT_APP_API_URL}/users/login/kakao`, { code })
    .then((res) => {
      console.log("응답 데이터 ===", res.data);
      dispatch(login(res.data.data));
      navigate('/')
    })
    .catch((err) => console.log(err));
  }
  return <div>LandingPage</div>
}

export default LandingPage
