import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import landimg from '../images/landimage.png'
import map from '../images/map.png'
import check from '../images/check.png'
import community from '../images/community.png'
import onroad from '../images/onroad.png'

function LandingPage() {
  // 스크롤 초기화
  useEffect(()=>{
    document.documentElement.scrollTop=0;
  },[]);

  return (
    <div id="landingContainer">
      <div className="introBox">
        <div className="introTextBox">
          <p className="line1">국내 루트 공유 서비스</p>
          <p className="line2">원데이 코스를 짜야 할 땐?</p>
          <p className="line3">지금 바로 Roadgram!</p>
          <p className="line4">나만의 루트를 작성하고, 많은 사람들과 공유해 보세요.</p>
          <Link to="/main" style={{ textDecoration: 'none' }}>
            <button className="moreButton" type="button">
              더보기
            </button>
          </Link>
        </div>
        <div className="landimgBox">
          <img className="landimg" src={landimg} alt="landimg" />
        </div>
      </div>
      <div className="featureBox">
        <div className="mainTitle">Our Service</div>
        <div className="serviceBox">
          <div className="serviceInfoBox">
            <img className="serviceImage" src={map} alt="routeimg" />
            <p className="subtitle">나만의 루트 작성</p>
            <p className="subContent">지도에서 나만의 루트를 작성하고,</p>
            <p className="subContent">사진과 함께 기록해 보세요.</p>
          </div>
          <div className="serviceInfoBox">
            <img className="serviceImage" src={check} alt="routeimg" />
            <p className="subtitle">정보 확인</p>
            <p className="subContent">다른 사람들이 추천하는 루트 정보를</p>
            <p className="subContent">한 눈에 볼 수 있어요!</p>
          </div>
          <div className="serviceInfoBox">
            <img className="serviceImage" src={community} alt="routeimg" />
            <p className="subtitle">소통</p>
            <p className="subContent">SNS 기능으로 루트를</p>
            <p className="subContent">공유하고 소통할 수 있어요.</p>
          </div>
        </div>
      </div>
      <div className="startBox">
        <img className="onroadimage" src={onroad} alt="onroad" />
        <div className="startContent">
          <p>Roadgram에서</p>
          <p>나만의 여정을 기록하고 공유해요!</p>
        </div>
        <Link to="/settingroute" style={{ textDecoration: 'none' }} className="startButton">
          <div>시작하기</div>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
