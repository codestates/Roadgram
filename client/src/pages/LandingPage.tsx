import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/AuthSlice';
import Footer from '../components/Footer'

function LandingPage() {

  /// 여기 작성 부분은 Login시 메인페이지로 변경 예정
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
  return (
    <div id="landingContainer">
      <div className="introBox">
        <p className="line1">쉬는날 어디로 놀러갈까?</p>
        <p className="line2">Roadgram!</p>
        <p className="line3">다양한 여행로드 제공 서비스</p>
        <p className="line4">나만의 여행로드를 작성하고, 많은 사람들과 공유해 보세요.</p>
      </div>
      <div className="featureBox">
        <div className="textBox">
          <p className="title">나만의 여행 루트를 작성!</p>
          <p className="content">지도에서 나만의 여행루트를 작성하고,</p>
          <p className="content">사진을 담아 기록해 보세요.</p>
        </div>
        <div className="imageBox">
          <img
            className="landingImage"
            src="https://user-images.githubusercontent.com/82630476/153759892-d9e32492-0fb3-4e90-9580-6e38c7ec1980.jpg"
            alt="루트 작성 이미지"
          />
        </div>
      </div>
      <div className="featureBox">
        <div className="textBox">
          <p className="title"> 여행정보 피드 기능!</p>
          <p className="content">다양한 사람들의 여행 정보를</p>
          <p className="content">한눈에 볼 수 있어요!</p>
        </div>
        <div className="imageBox">
          <img
            className="landingImage"
            src="https://user-images.githubusercontent.com/82630476/153759815-5bcaef4e-b8a1-4dae-9308-c6ad883dace8.jpg"
            alt="피드 이미지"
          />
        </div>
      </div>
      <div className="featureBox">
        <div className="textBox">
          <p className="title"> 여행정보 피드 기능!</p>
          <p className="content">커뮤니티 기능으로 여행루트를</p>
          <p className="content">공유하고 소통할 수 있어요!</p>
        </div>
        <div className="imageBox">
          <img
            className="landingImage"
            src="https://user-images.githubusercontent.com/82630476/153759884-f0bf7604-e187-4970-ab75-cf1a3871ce57.jpg"
            alt="커뮤니티 이미지"
          />
        </div>
      </div>
      <div className="startBox">
        <div className="startTextBox">
          <p className="startText">Roadgram 에서</p>
          <p className="startText">나만의 여정을 기록하고 공유해요!</p>
          <Link to="/main" style={{ textDecoration: 'none', color: 'rgb(80, 78, 78)' }}>
            <button className="startButton" type="button">
              시작하기
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
