/* Library import */
import React, { createRef, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import kakaoLogin from '../images/kakao.png'
import '../style.scss'
/* Store import */
import { login } from '../store/AuthSlice';

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /* 인풋 정보 상태 */
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })

  const kakao = (window as any).Kakao;
  // SDK는 한 번만 초기화해야 한다.
  // 중복되는 초기화를 막기 위해 isInitialized()로 SDK 초기화 여부를 판단한다.



  /* input 태그 change 핸들러 */
  function handleInputValue(key: string) {
    return (e: { target: { value: string} } ) => {
      setLoginInfo({ ...loginInfo, [key]: e.target.value })
    }
  }

  /* login 핸들러 */
  const loginHandler = async () => {
    const { email, password } = loginInfo
    console.log("email ===", email, "password", password);
    try {
      if (!email) {
        alert("이메일을 입력 해 주세요");
      } else if (!password) {
        alert("패스워드를 입력 해 주세요");
        return;
      } else {
        /* reponse 변수에 /users/login 서버 응답결과를 담는다 */
        await axios
        .post(`${process.env.REACT_APP_API_URL}/users/login`,{ email, password })
        .then((res) => {
          /* 서버의 응답결과에 유저정보가 담겨있으면 로그인 성공 */
          /* 테스트 값 */
          // const result = {...res.data.data, loginMethod: 0};
          // dispatch(login(result))
          // 백업 데이터
          dispatch(login(res.data.data));
          navigate('/main') // 메인페이지로 이동!
        })
        .catch((err) => {
          console.log(err)
          alert("아이디 혹은 비밀번호를 확인 해 주세요.")
        })
      } 
    } catch (err) {
      console.log(err)
    }  
  }

  const kakaoHandler = async () => {
    kakao.Auth.authorize({
      redirectUri: "http://localhost:3000/main" // 메인페이지로 redirect 예정
    });
  }

  function redirectToSignup() {
    navigate('/signup')
  }

  function handleKeyDown () {
    console.log("?")
  }

  function redirectToFindPassword() {
    alert("비밀번호찾기 서비스 준비 중");
  }
  return (
    <div className="login_whole_div">
      <form className="login_main_div" >
        <img className="login_logo_img" alt="logo" src={logo} />
        <input className="login_email_input" type="text" placeholder="이메일" onChange={handleInputValue('email')} />
        <input className="login_password_input" type="password" placeholder="비밀번호" onChange={handleInputValue('password')} />
        <button className="login_login_button" type="button" onClick={loginHandler}>로그인</button>
        <img className="login_kakao_button" alt="kakaologin" src={kakaoLogin} onClick={kakaoHandler} onKeyDown={handleKeyDown}/>
        <div className="login_side_div">
          <button className="login_findpassword_button" type="button" onClick={redirectToFindPassword}>비밀번호 찾기</button>
          <button className="login_signup_button" type="button" onClick={redirectToSignup}>회원가입</button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
