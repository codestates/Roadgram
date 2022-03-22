import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import AWS, { S3 } from 'aws-sdk';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '..';
import { logout, newAccessToken, updateUserInfo } from '../store/AuthSlice';
import { update } from '../store/UserInfoSlice';
import { withdrawalModal } from '../store/ModalSlice';
import WithdrawalModal from '../components/Modals/WithdrawalModal';


function EditProfilePage(): any {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  const [editInform, setEditInform] = useState({
    nickname: '',
    statusMessage: '',
    profileImage: '',
    password: '',
    passwordCheck: ''
  })
  const [nicknameAvailability, setNicknameAvailability] = useState(false);
  const [passwordAvailability, setPasswordAvailability] = useState(true);
  const [isPasswordSame, setIsPasswordSame] = useState(true);

  const [scroll,setScroll] =useState(0); // 스크롤 방지 기능을 위해 현재 스크롤 위치 저장

  /* 로그인 안된 상태에서 접근 차단 */
  useEffect(() => {
    document.documentElement.scrollTop=0;
    if (!auth.isLogin) {
      alert('로그인이 필요합니다');
      navigate('/logins');
    }
  }, []);

  /* 비밀번호 일치여부 및에 띄우기 */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    else {
      checkPasswordAvailability();
      if (editInform.password === editInform.passwordCheck && passwordAvailability) setIsPasswordSame(true)
      else if (editInform.password === editInform.passwordCheck && editInform.password === '') {
        setIsPasswordSame(true);
        setPasswordAvailability(true);
      }
      else setIsPasswordSame(false);
    }
  }, [editInform.password, editInform.passwordCheck]);


  /* s3 버킷 설정 */
  AWS.config.region = 'ap-northeast-2'; // 리전
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:2103383f-abd8-41b1-bd30-b700ce368c14',
  });

  /* s3 버킷 업로드 합수 */
  const imageHandler = (e: any) => {
    const firstImageFile = e.target.files[0];
    if (!firstImageFile) {
      setEditInform({ ...editInform, profileImage: '' });
    }
    else {
      const upload = new S3.ManagedUpload({
        params: {
          Bucket: "ootd13image",
          Key: firstImageFile.name,
          Body: firstImageFile,
        },
      });
      const promise = upload.promise();
      promise.then(
        function (data: any) {
          setEditInform({ ...editInform, profileImage: data.Location });
        },
        function (err: any) {
          console.log(err);
        }
      );
    }
  };

  const inputValueHandler = (e: any, key: string) => {
    if (key === 'nickname') setNicknameAvailability(false);
    setEditInform({ ...editInform, [key]: e.target.value })
  }

  const nicknameCheck = async () => {
    if (!editInform.nickname) {
      return alert('닉네임을 입력하세요.')
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/nicknamecheck`, { nickname: editInform.nickname });
      setNicknameAvailability(true);
      return alert('사용가능한 닉네임입니다.');
    } catch {
      setNicknameAvailability(false);
      return alert('중복된 닉네임입니다');
    }
  }

  const checkPasswordAvailability = () => {
    const { password } = editInform;
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,50}$/;
    if (!password.match(regExp)) {
      setPasswordAvailability(false);
    } else {
      setPasswordAvailability(true);
    }
  }

  /* 액세스토큰 재발급 요청 */
  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${auth.userInfo.id}&loginMethod=${auth.userInfo.loginMethod}`, {
      headers: { authorization: `${auth.refreshToken}` }
    });
    dispatch(newAccessToken(response.data.data));
  }

  const { isWithdrawalModal } = useSelector((state: RootState) => state.modal);

  const openWithdrawalModal = () => {
    dispatch(withdrawalModal(!isWithdrawalModal));
  }

  // 모달 창 띄울 시 스크롤 고정
  useEffect(() => {
    if (isWithdrawalModal) {
      setScroll(document.documentElement.scrollTop) // 현재 스크롤 위치 저장
      // css텍스트 고정으로 변경
      document.documentElement.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width:100%;
      `;
    }
    else{
      document.documentElement.scrollTop=scroll; // 저장해둔 스크롤 위치로 이동
      setScroll(0);// 스크롤 위치 상태 초기화 
    }
    return () => {
      document.documentElement.style.cssText ='';
    }
  }, [isWithdrawalModal])

  const submitHandler = async () => {
    const body: any = {};
    if (editInform.profileImage) body.profileImage = editInform.profileImage;
    body.statusMessage = editInform.statusMessage;
    if (editInform.nickname) {
      if (editInform.nickname.length === 1 || editInform.nickname.length > 15) return alert("닉네임은 2~15자 이내로 입력바랍니다.");
      if (!nicknameAvailability) return alert("닉네임 중복 여부를 확인 해 주시기 바랍니다.");
      body.nickname = editInform.nickname;
    }
    if (editInform.password) {
      if (!passwordAvailability) return alert("비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.");
      if (editInform.password !== editInform.passwordCheck) return alert('비밀번호가 일치하지 않습니다.');
      body.password=editInform.password;
    }
    /* api 요청 시작 */
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/users/profile`,
        { user: auth.userInfo.id, loginMethod: auth.userInfo.loginMethod, ...body },
        { headers: { authorization: `${auth.accessToken}`} }
      );
      dispatch(updateUserInfo(response.data.data));
      return navigate(`/userinfo?id=${auth.userInfo.id}`);
    } catch (err: any) {
      /* 401에러는 개발 완료되면 제외되도 되는 경우의 수라 나중에 개발 후에 제거해도 됨 */
      if (err.response.data.statusCode === 401) {
        /* 액세스토큰 요청 */
        try {
          await accessTokenRequest();
        } catch {
          dispatch(logout());
          alert('다시 로그인해 주세요.')
          return navigate('/logins')
        }
        /* 이전 요청 한번 더 */
        try {
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/users/profile`,
            { user: auth.userInfo.id, loginMethod: auth.userInfo.loginMethod, ...body },
            { headers: { authorization: `${auth.accessToken}`} }
          );
          dispatch(updateUserInfo(response.data.data));
          return navigate(`/userinfo?id=${auth.userInfo.id}`);
        } catch {
          dispatch(logout());
          alert('잘못된 시도입니다.');
          return navigate('/main')
        }
      }
      else {
        alert('잘못된 시도입니다.');
        dispatch(logout());
        return navigate('/main')
      }
    }
  }

  return (
    <div className='editProfile_whole_div'>
      <div className='editProfile_main_div'>
        <div className='editProfile_title_box'>
          <Link to={`/userinfo?id=${auth.userInfo.id}`}>
            <div className='editProfile_arrow_box'>
              <FontAwesomeIcon className='editProfile_arrow_icon' icon={faArrowLeft}/>
            </div>
          </Link>
          <h1>내 정보 수정</h1>
        </div>
        <div className='editProfile_imageBox_div'>
          <h3 className='editProfile_title'>프로필 사진</h3>
          <label className='editProfile_image_label' htmlFor='editProfile_image_label'>
            <div className='editProfile_image_section'>
              {editInform.profileImage ?
                <img className='editProfile_image_img' src={editInform.profileImage} alt="" />
                : <img className='editProfile_image_img' src={auth.userInfo.profileImage || 'https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%91%E1%85%B5%E1%84%8C%E1%85%A9%E1%86%AB%E1%84%90%E1%85%AE.jpeg'} alt='' />}
            </div>
            <div className='editProfile_icon_section'>
              <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
            </div>
          </label>
          <input id='editProfile_image_label' className='hidden' accept='image/*' type="file" onChange={imageHandler} />
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>상태메세지</h3>
          <input className='editProfile_message_input' type='text' placeholder='상태메세지' onChange={(e) => inputValueHandler(e, 'statusMessage')} />
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>닉네임</h3>
          <div className='editProfile_nickname_box'>
            <input className='editProfile_password_input' type='text' placeholder='닉네임' onChange={(e) => inputValueHandler(e, 'nickname')} />
            <button type='submit' className='editProfile_nickname_button' onClick={nicknameCheck}>중복체크</button>
          </div>
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>이메일</h3>
          <div className='editProfile_email_div'>{auth.userInfo.email?auth.userInfo.email:`kimcoding@gmail.com`}</div>
        </div>
        {auth.userInfo.loginMethod===0?
          <div className='editProfile_box_div'>
            <h3 className='editProfile_title'>패스워드</h3>
            <input className='editProfile_password_input' type='password' placeholder='비밀번호' onChange={(e) => inputValueHandler(e, 'password')} />
            {!passwordAvailability ? <span className='editProfile_password_span'>비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.</span> : <span> </span>}
          </div>:null}
        {auth.userInfo.loginMethod===0?
          <div className='editProfile_box_div'>
            <h3 className='editProfile_title'>패스워드 확인</h3>
            <input className='editProfile_password_input' type='password' placeholder='비밀번호 확인' onChange={(e) => inputValueHandler(e, 'passwordCheck')} />
            {!isPasswordSame ? <span className='editProfile_passwordCheck_span'>비밀번호가 일치하지 않습니다.</span> : <span> </span>}
          </div>:null}
        <div className='editProfile_submit_div'> 
          <button className='editProfile_submit_button' type='button' onClick={openWithdrawalModal}>회원탈퇴</button>
          <button className='editProfile_submit_button1' type='button' onClick={submitHandler}>수정완료</button>
        </div>
        {isWithdrawalModal ? <WithdrawalModal /> : null}
      </div>
    </div>
  )
}

export default EditProfilePage
