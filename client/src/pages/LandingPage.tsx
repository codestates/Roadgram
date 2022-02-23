import { Link } from 'react-router-dom'
import React from 'react'
import Footer from '../components/Footer'

function LandingPage() {
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
