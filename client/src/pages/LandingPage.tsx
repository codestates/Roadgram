import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/AuthSlice';

function LandingPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    if (authorizationCode) {
        // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
        // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
        getAccessToken(authorizationCode)
    }
  }, [])

  async function getAccessToken(code: string) {

    await axios
    .post('http://localhost:5000/users/login/kakao', { code })
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
