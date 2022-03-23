import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '..'


function SignupPage() {
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const {isLogin}=useSelector((state:RootState)=>state.auth)

  const [signupInform, setSignupInform] = useState(
    { email: "",
      nickname: "",
      password: "",
      passwordCheck: ""
    });
  const [emailValidity, setEmailValidity] = useState(false);
  const [nicknameValidity, setNicknameValidity] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [isSamePassword, setIsSamePassword] = useState(false);

  // 패스워드 유효성 검사
  useEffect(() => {
    if (!isInitialMount.current) {
      checkPasswordValidity()
    } 
  }, [signupInform.password])

  // 패스워드 확인 유효성 검사
  useEffect(() => {
    if (!isInitialMount.current) {
      checkPasswordSameness()
    } 
  }, [signupInform.passwordCheck])

  // 이메일 유효성 검사
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      checkEmailValidity()
    }
  }, [signupInform.email])

  // 이미 로그인 상태 시 메인페이지로 이동
  useEffect(()=>{
    document.documentElement.scrollTop=0;// 스크롤 초기화
    if(isLogin){
      alert('이미 로그인된 상태입니다.');
      navigate('/main');
    }
  },[])
  
  function handleInputValue(e: any, key: string) {
    setSignupInform({ ...signupInform, [key]: e.target.value })
  }

  function checkPasswordValidity() {
    const {password} = signupInform;
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,50}$/;
    if(!password.match(regExp)) {
      setPasswordValidity(false);
    } else {
      setPasswordValidity(true);
    }
  }

  function checkPasswordSameness() {
    const {password, passwordCheck} = signupInform;
    if(password === passwordCheck) {
      setIsSamePassword(true)
    } else {
      setIsSamePassword(false)
    }
  }

  
  async function checkNickname(e: any) {
    e.preventDefault();
    const {nickname} = signupInform;

    if(nickname.length < 2 || nickname.length > 15) {
      alert("별명은 2~15자 이내로 입력바랍니다.");
    } else {
      await axios
      .post(`${process.env.REACT_APP_API_URL}/users/nicknamecheck`, {nickname})
      .then((res) => {
        setNicknameValidity(true);
        alert("사용 가능한 별명입니다.");
      })
      .catch((err) => {
        setNicknameValidity(false);
        alert("이미 사용 중인 별명입니다.")
      }); 
    }
  }
  function checkEmailValidity() {
    const {email} = signupInform;
    const regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    
    if(!email.match(regExp)) {
      setEmailValidity(false);
    } else {
      setEmailValidity(true);
    }
  }

  async function checkEmail(e: any) {
    e.preventDefault();
    const {email} = signupInform;

    if(!emailValidity) {
      alert("이메일 형식이 올바르지 않습니다.");
    } else {
      await axios
      .post(`${process.env.REACT_APP_API_URL}/users/emailcheck`, {email})
      .then((res) => {
        setEmailValidity(true);
        alert("사용 가능한 이메일입니다.")
      })
      .catch((err) => {
        alert("이미 사용 중인 이메일입니다.")
      });
    }
  }
  
  async function handleSignup(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const {email, password, nickname} = signupInform;

    if(nickname.length === 1 || nickname.length > 15) {
      alert("닉네임은 2~15자 이내로 입력바랍니다.");
    } else if(!nicknameValidity) {
      alert("닉네임 중복 여부를 확인 해 주시기 바랍니다.");
    } else if(!emailValidity) {
      alert("이메일 형식이 올바르지 않습니다.");
    } else if(!passwordValidity) {
      alert("비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.");
    } else if(!isSamePassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    } else {
      await axios
      .post(`${process.env.REACT_APP_API_URL}/users/signup`, {email, password, nickname})
      .then((res) => {
        alert("회원가입에 성공했습니다.");
        navigate("/");
      })
      .catch((err) => {
        alert("회원가입에 실패했습니다.")
      })
    }
  }

  return (    
    <div className="signup_whole_div">
      <form className="signup_main_div" onSubmit={(event)=> handleSignup(event)}>
        <div className="signup_title_div">
          <div className="arrow_icon_div">
          <Link to="/logins">
          <FontAwesomeIcon icon={faArrowLeft} className="arrow_icon"/>
          </Link>
          </div>
          <h1 className="signup_title">회원가입</h1>
        </div>
          <div className="signup_nickname_div">
            <h3 className="signup_nickname_title">닉네임</h3>  
            <div>
              <input className="signup_nickname_input" type="text" placeholder="닉네임" onChange={() => {setNicknameValidity(false)}} onBlur={(e) => handleInputValue(e, 'nickname')} />
              <button className="signup_nickname_button" type="button" onClick={checkNickname}>중복체크</button>
            </div>
            {signupInform.nickname.length === 1 || signupInform.nickname.length > 15
            ? <span className="signup_nickname_span hide">별명은 2~15자 이내로 입력 가능합니다.</span>
            : null 
            }
          </div>
          <div className="signup_email_div">
            <h3 className="signup_email_title">이메일</h3>
            <div>
              <input className="signup_email_input" type="text" placeholder="이메일" onBlur={(e) => handleInputValue(e, 'email')} />
              <button className="signup_email_button" type="button" onClick={checkEmail}>중복체크</button>
            </div>
            {!emailValidity && signupInform.email.length > 0
            ? <span className="signup_email_span hide">이메일 형식이 올바르지 않습니다.</span>
            : null 
            }
          </div>
          <div className="signup_password_div">
            <h3 className="signup_password_title">비밀번호</h3>
            <input className="signup_password_input" type="password" placeholder="비밀번호" onBlur={(e) => handleInputValue(e, 'password')} />
            {!passwordValidity && signupInform.password.length > 0
            ? <span className="signup_password_span hide">비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.</span>
            : null 
            }
          </div>
          <div className="signup_passwordcheck_div">
            <h3 className="signup_passwordcheck_title">비밀번호 확인</h3>
            <input className="signup_passwordcheck_input" type="password" placeholder="비밀번호 확인" onBlur={(e) => handleInputValue(e, 'passwordCheck')} />
            {!isSamePassword && signupInform.passwordCheck.length > 0
            ? <span className="signup_passwordcheck_span hide">비밀번호가 일치하지 않습니다.</span>
            : null 
            }
          </div>
          <button className="signup_signup_button" type="submit" onClick={(event)=> handleSignup(event)}>가입하기</button>
      </form>
    </div>
  )
}

export default SignupPage
