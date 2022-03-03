import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '..'

declare global {
  interface Window {
    kakao: any
  }
}

function Map() {
  const { articleInfo } = useSelector((state: RootState) => state.articleDetails)

  // 지도의 범위를 설정하는 함수를 불러온다
  const bounds = new window.kakao.maps.LatLngBounds()

  const markerImageUrl = 'https://i.ibb.co/VBqLpfN/location2.png' // 마커 이미지
  const markerImageSize = new window.kakao.maps.Size(55, 55) // 마커 이미지의 크기
  const markerImageOptions = {
    offset: new window.kakao.maps.Point(30, 50), // 마커 좌표에 일치시킬 이미지 안의 좌표
  }
  // 루트설정 마커 이미지를 생성한다
  const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions)

  const createMap = () => {
    const mapBounds = () => {
      map.setBounds(bounds)
    }

    // 지도를 표시할 div
    const mapContainer = document.getElementById('map')
    // 지도의 옵션들..

    const mapOption = {
      center: new window.kakao.maps.LatLng(37.56682, 126.97865), // 처음 시작할 때 지도의 중심좌표 (서울시청)
      level: 3, // 지도의 확대 레벨
      mapTypeId: window.kakao.maps.MapTypeId.ROADMAP, // 지도종류
    }
    // 지도를 생성한다
    const map = new window.kakao.maps.Map(mapContainer, mapOption)

    articleInfo.roads.forEach(location => {
      const routeMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(location.y, location.x), // 마커의 좌표
        image: markerImage, // 마커의 이미지
        map, // 마커를 표시할 지도 객체
      })

      bounds.extend(new window.kakao.maps.LatLng(location.y, location.x))

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
        <div style=
        "width:150px;
        text-align:center;
        padding:6px 0;
        font-weight: 600;
        font-size: 1.2rem;
        z-index: 999;
        // border-radius: 1rem;
        ">
          ${location.placeName}
        </div>`,
      })

      window.kakao.maps.event.addListener(routeMarker, 'mouseover', function () {
        infowindow.open(map, routeMarker)
      })
      window.kakao.maps.event.addListener(routeMarker, 'mouseout', function () {
        infowindow.close()
      })

      const customOverlay = new window.kakao.maps.CustomOverlay({
        map,
        content: `
        <div style="
          border-radius: 100%; 
          padding: 0.3rem 0.8rem; 
          font-size:16px; 
          color: white; 
          font-weight:700; 
          background:#EF6D6D;
          display:flex;
          justify-content: center;
          align-item: center;
        ">
          ${articleInfo.roads.indexOf(location) + 1}
        </div>`,
        position: new window.kakao.maps.LatLng(location.y, location.x), // 커스텀 오버레이를 표시할 좌표
        xAnchor: 0.6, // 컨텐츠의 x 위치
        yAnchor: 0.1, // 컨텐츠의 y 위치
      })

      customOverlay.setMap(map) // 지도에 올린다.

      mapBounds()

      for (let i = 0; i < articleInfo.roads.length; i += 1) {
        if (articleInfo.roads[i]) {
          const currLat: any = articleInfo.roads[i].y
          const currLng: any = articleInfo.roads[i].x
          if (i >= 1) {
            const prevLat: any = articleInfo.roads[i - 1].y
            const prevLng: any = articleInfo.roads[i - 1].x
            const linePath = [
              new window.kakao.maps.LatLng(prevLat, prevLng),
              new window.kakao.maps.LatLng(currLat, currLng),
            ]
            const polyline = new window.kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: 'black',
              strokeOpacity: 0.7,
              strokeStyle: 'dashed',
            })
            polyline.setMap(map)
          }
        }
      }
    })
  }

  useEffect(() => {
    if (articleInfo.roads) {
      createMap()
    }
  }, [articleInfo])

  return (
    <div className="mapBox">
      <div id="map" className="detailMap" />
    </div>
  )
}

export default Map
