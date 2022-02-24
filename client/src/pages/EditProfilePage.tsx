import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import AWS, { S3 } from 'aws-sdk';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '..';
import { logout, newAccessToken, updateUserInfo } from '../store/AuthSlice';
import { update } from '../store/UserInfoSlice';

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

  /* 로그인 안된 상태에서 접근 차단 */
  useEffect(() => {
    if (!auth.isLogin) {
      alert('로그인이 필요합니다');
      navigate('/logins');
    }
  }, [auth.isLogin]);

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

  /* 서버 api 요청 */
  const updateUserRequest = async (body: any) => {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/users/profile`,
      { user: auth.userInfo.id, loginMethod: auth.userInfo.loginMethod, ...body },
      { headers: { authorization: auth.accessToken || '' } }
    );
    dispatch(updateUserInfo(response.data.data));
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${auth.userInfo.id}&page=1`);
    dispatch(update(res.data.data)); // userInfo 정보 update
    return navigate(`/userinfo/${auth.userInfo.id}`);
  }

  /* 액세스토큰 재발급 요청 */
  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${auth.userInfo.id}&loginMethod=${auth.userInfo.loginMethod}`, {
      headers: { authorization: auth.refreshToken || '' }
    });
    dispatch(newAccessToken(response.data.data));
  }

  const submitHandler = async () => {
    const body: any = {};
    if (editInform.profileImage) body.profileImage = editInform.profileImage;
    body.statusMessage = editInform.statusMessage;
    if (editInform.nickname) {
      if (editInform.nickname.length === 1 || editInform.nickname.length > 15) return alert("닉네임은 2~15자 이내로 입력바랍니다.");
      if (!nicknameAvailability) return alert("닉네임 중복 여부를 확인 해 주시기 바랍니다.");
      body.profileImage = editInform.nickname;
    }
    if (editInform.password) {
      if (!passwordAvailability) return alert("비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.");
      if (editInform.password !== editInform.passwordCheck) return alert('비밀번호가 일치하지 않습니다.');
      body.profileImage = editInform.password;
    }
    /* api 요청 시작 */
    try {
      return await updateUserRequest(body);
    } catch (err: any) {
      /* 401에러는 개발 완료되면 제외되도 되는 경우의 수라 나중에 개발 후에 제거해도 됨 */
      if (err.response.data.statusCode === 401) {
        /* 액세스토큰 요청 */
        try {
          await accessTokenRequest();
        } catch {
          dispatch(logout());
        }
        /* 이전 요청 한번 더 */
        try {
          return await updateUserRequest(body);
        } catch {
          return alert('다시 시도해주세요');
        }
      }
      else return alert('잘못된 시도입니다.');
    }
  }

  return (
    <div className='editProfile_whole_div'>
      <div className='editProfile_main_div'>
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
          <div>
            <input className='editProfile_password_input' type='text' placeholder='닉네임' onChange={(e) => inputValueHandler(e, 'nickname')} />
            <button type='submit' className='editProfile_nickname_button' onClick={nicknameCheck}>중복체크</button>
          </div>
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>이메일</h3>
          <div className='editProfile_email_div'>{auth.userInfo.email}</div>
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>패스워드</h3>
          <input className='editProfile_password_input' type='password' placeholder='비밀번호' onChange={(e) => inputValueHandler(e, 'password')} />
          {!passwordAvailability ? <span className='editProfile_password_span'>비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.</span> : null}
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>패스워드 확인</h3>
          <input className='editProfile_password_input' type='password' placeholder='비밀번호 확인' onChange={(e) => inputValueHandler(e, 'passwordCheck')} />
          {!isPasswordSame ? <span className='editProfile_passwordCheck_span'>비밀번호가 일치하지 않습니다.</span> : null}
        </div>
        <div className='editProfile_submit_div'> 
          <button className='editProfile_submit_button' type='button'>회원탈퇴</button>
          <button className='editProfile_submit_button' type='button' onClick={submitHandler}>수정완료</button>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
