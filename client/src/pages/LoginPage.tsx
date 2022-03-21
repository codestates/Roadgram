/* Library import */
import React, { createRef, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import kakaoLogin from '../images/kakao.png'
import '../style.scss'
/* Store import */
import { login } from '../store/AuthSlice';
import { RootState } from '..'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /* 인풋 정보 상태 */
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })
  const {isLogin} = useSelector((state: RootState) => state.auth);
  
  const kakao = (window as any).Kakao;
  // SDK는 한 번만 초기화해야 한다.
  // 중복되는 초기화를 막기 위해 isInitialized()로 SDK 초기화 여부를 판단한다.

  // 스크롤 초기화
  useEffect(()=>{
    document.documentElement.scrollTop=0;
  },[]);

  // 이미 로그인시 메인페이지로 이동
  useEffect(()=>{
    if(isLogin){
      alert('이미 로그인된 상태입니다.');
      navigate('/main');
    }
  },[])
  
  /* input 태그 change 핸들러 */
  function handleInputValue(key: string) {
    return (e: { target: { value: string} } ) => {
      setLoginInfo({ ...loginInfo, [key]: e.target.value })
    }
  }

  /* login 핸들러 */
  const loginHandler = (event:any) => {
    event.preventDefault();
    const { email, password } = loginInfo
      if (!email) {
        alert("이메일을 입력 해 주세요");
      } else if (!password) {
        alert("패스워드를 입력 해 주세요");
      } else {
        /* reponse 변수에 /users/login 서버 응답결과를 담는다 */
        axios
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
          alert("아이디 혹은 비밀번호를 확인 해 주세요.")
        })
      } 
  }

  const kakaoHandler = async () => {
    kakao.Auth.authorize({
      // 로컬에서 테스트 시 "http://localhost:3000/main"로 변경 필요
      // redirectUri: "http://localhost:3000/main"
      redirectUri: "https://roadgram.net/main"
    });
  }

  function redirectToSignup() {
    navigate('/signup')
  }

  return (
    <div className="login_whole_div">
      <form className="login_main_div">
        <h1 className="login_logo_title">로그인</h1>
        <h3>이메일</h3>
        <input className="login_email_input" type="text" placeholder="이메일을 입력해주세요" onChange={handleInputValue('email')} />
        <h3>비밀번호</h3>
        <input className="login_password_input" type="password" placeholder="비밀번호를 입력해주세요" onChange={handleInputValue('password')} />
        <li 
          className="login_findpassword_button" 
          onClick={()=>alert("비밀번호 찾기 서비스는 준비 중입니다.")}
          onKeyDown={()=>alert("비밀번호 찾기 서비스는 준비 중입니다.")}
        >비밀번호 찾기</li>
        <div className="button_div">
          <button className="login_login_button" type="submit" onClick={(event) => loginHandler(event)}>로그인</button>
          <button className="login_signup_button" type="button" onClick={redirectToSignup}>회원가입</button>
          <img className="login_kakao_button" alt="kakaologin" src={kakaoLogin} onClick={kakaoHandler} onKeyDown={kakaoHandler}/>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
