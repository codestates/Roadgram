/* Library import */
import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
/* Store import */
import { login, getUserInfo } from '../store/AuthSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /* 인풋 정보 상태 */
  const [loginInfo, setLoginInfo] = useState({
    user_id: '',
    password: '',
  })
  /* input 태그 change 핸들러 */
  const handleInputValue = (key: string) => (e: { target: { value: string } }) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value })
  }
  /* login 핸들러 */
  const loginHandler = async () => {
    try {
      /* reponse 변수에 /users/login 서버 응답결과를 담는다 */
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        { email: loginInfo.user_id, password: loginInfo.password },
        { withCredentials: true },
      )
      /* 서버의 응답결과에 유저정보가 담겨있으면 로그인 성공 */
      if (response.data.data) {
        dispatch(getUserInfo(response.data.data.userInfo))
        dispatch(login())
        navigate('/main') // 메인페이지로 이동!
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <input type="text" placeholder="이메일" onChange={handleInputValue('user_id')} />
      <input type="password" placeholder="비밀번호" onChange={handleInputValue('password')} />
      <button type="button" onClick={loginHandler}>
        로그인
      </button>
    </div>
  )
}

export default LoginPage
