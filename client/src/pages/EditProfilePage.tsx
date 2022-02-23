import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import AWS, { S3 } from 'aws-sdk';
import axios from 'axios';
import { RootState } from '..';
import { logout, newAccessToken, updateUserInfo } from '../store/AuthSlice';

function EditProfilePage() {
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

  const updateUserRequest = async (body: any) => {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/users/profile`,
      { user: auth.userInfo.id, loginMethod: auth.userInfo.loginMethod, ...body },
      { headers: { authorization: auth.accessToken || '' } }
    );
    dispatch(updateUserInfo(response.data.data));
    return navigate(`/userinfo/${auth.userInfo.id}`);
  }

  const accessTokenRequest = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth?user=${auth.userInfo.id}&loginMethod=${auth.userInfo.loginMethod}`, {
      headers: { authorization: auth.refreshToken || '' }
    });
    dispatch(newAccessToken(response.data.data))
  }

  const submitHandler = async () => {
    const body: any = {};
    if (editInform.profileImage) body.profileImage = editInform.profileImage;
    if (editInform.statusMessage) body.statusMessage = editInform.statusMessage;
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
    /* 권한 요청 */
    try {
      return await updateUserRequest(body);
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        /* 액세스토큰 요청 */
        try {
          await accessTokenRequest();
        } catch {
          dispatch(logout());
          alert('다시 로그인해 주세요');
          return navigate('/logins');
        }
        /* 이전 요청 한번 더 */
        try {
          return updateUserRequest(body);
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
          <label htmlFor='editProfile_image_label'>
            {editInform.profileImage ?
              <img className='editProfile_image_img' src={editInform.profileImage} alt="" />
              : <img className='editProfile_image_img' src={auth.userInfo.profileImage || 'https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%91%E1%85%B5%E1%84%8C%E1%85%A9%E1%86%AB%E1%84%90%E1%85%AE.jpeg'} alt='' />}
          </label>
          <input id='editProfile_image_label' className='hidden' accept='image/*' type="file" onChange={imageHandler} />
        </div>
        <div className='editProfile_messageBox_div'>
          <h3 className='editProfile_title'>상태메세지</h3>
          <input className='editProfile_message_input' type='text' placeholder='상태메세지' onChange={(e) => inputValueHandler(e, 'statusMessage')} />
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>닉네임</h3>
          <input className='editProfile_nickname_input' type='text' placeholder='닉네임' onChange={(e) => inputValueHandler(e, 'nickname')} />
          <button type='submit' className='editProfile_nickname_button' onClick={nicknameCheck}>중복체크</button>
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>이메일</h3>
          <div className='editProfile_email_div'>{auth.userInfo.email}</div>
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>패스워드</h3>
          <input className='editProfile_password_input' type='password' placeholder='비밀번호' onChange={(e) => inputValueHandler(e, 'password')} />
          {!passwordAvailability ? <span className='editProfile_password_span'>비밀번호 틀렸다 야</span> : null}
        </div>
        <div className='editProfile_box_div'>
          <h3 className='editProfile_title'>패스워드 확인</h3>
          <input className='editProfile_password_input' type='password' placeholder='비밀번호 확인' onChange={(e) => inputValueHandler(e, 'passwordCheck')} />
          {!isPasswordSame ? <span className='editProfile_passwordCheck_span'>둘이 안맞는다 야</span> : null}
        </div>
        <button className='editProfile_submit_button' type='button' onClick={submitHandler}>수정완료</button>
      </div>
    </div>
  )
}

export default EditProfilePage
