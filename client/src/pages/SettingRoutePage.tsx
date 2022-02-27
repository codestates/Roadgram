import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { create } from 'domain'
import { RootState } from '..'
import { getLocationList, deleteLocationList } from '../store/LocationListSlice'
import { getRouteList, AddRouteList, deleteRouteList } from '../store/RouteListSlice'
import { resetUserInfo } from '../store/UserInfoSlice'

// 글로벌로 kakao를 선언해주지 않으면 앱이 인식하지 못한다.
declare global {
  interface Window {
    kakao: any
  }
}

function SettingRoutePage() {
  const [word, setWord] = useState('') // 검색어 state
  const [createMarker, setCreateMarker] = useState(false) // 마커 생성여부 state
  const [addRoute1, setAddRoute1] = useState(false) // 장소추가 버튼 클릭 여부

  const { locationList } = useSelector((state: RootState) => state.locations)
  const { routeList } = useSelector((state: RootState) => state.routes)

  const dispatch = useDispatch()

  const deleteInformation = () => {
    // dispatch(deleteLocationList())
    dispatch(deleteRouteList())
  }

  // 검색창(input 태그) 입력값 받아와서 'word' State에 저장
  const changeWord = (e: any) => {
    setWord(e.target.value)
  }

  const ps = new window.kakao.maps.services.Places() // 카카오맵 키워드 검색기능을 받아온 것

  // 키워드 검색 작동
  const searching = () => {
    ps.keywordSearch(word, placesSearchCB)
  }

  // 카카오맵으로부터 키워드 검색해주는 함수
  function placesSearchCB(data: any, status: any, pagination: any) {
    if (status === window.kakao.maps.services.Status.OK) {
      setCreateMarker(true)
      dispatch(getLocationList(data)) // 검색결과 데이터를 store에 저장
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.') // 나중에 모달로 바꾸자...
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.') // 나중에 모달로 바꾸자...
    }
  }

  // 지도의 범위를 설정하는 함수를 불러혼다
  const bounds = new window.kakao.maps.LatLngBounds()

  // 루트설정 마커 이미지의 주소
  const markerImageUrl = 'https://i.ibb.co/k2WTnJr/maps-icons-825116.png'
  const markerImageSize = new window.kakao.maps.Size(40, 42) // 마커 이미지의 크기
  const markerImageOptions = {
    offset: new window.kakao.maps.Point(20, 42), // 마커 좌표에 일치시킬 이미지 안의 좌표
  }

  // 루트설정 마커 이미지를 생성한다
  const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions)

  // 카카오맵을 생성하는 함수
  const createMap = () => {
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

    // 검색이 실행되었다면 지도 위에 마커들을 생성합니다
    if (createMarker) {
      locationList.forEach(location => {
        // 결과값으로 받은 위치를 마커로 표시합니다
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(location.y, location.x),
          clickable: true,
        })

        // 마커 클릭 이벤트를 등록한다
        window.kakao.maps.event.addListener(marker, 'click', function () {
          alert('마커를 클릭했습니다!')
        })

        bounds.extend(new window.kakao.maps.LatLng(location.y, location.x))
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">
          <div>${location.place_name}</div><div>${location.address_name}</div>
          </div>`,
        })

        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
          infowindow.open(map, marker)
        })
        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close()
        })
      })
      map.setBounds(bounds) // 지도의 범위를 재설정한다
    }
    if (routeList.length >= 1) {
      routeList.forEach(route => {
        const routeMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(route.y, route.x), // 마커의 좌표
          image: markerImage, // 마커의 이미지
          map, // 마커를 표시할 지도 객체
        })

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px; padding: 6px; text-align:center; 0;">
        <div>${route.place_name}</div>
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
          content: `<div style="border-radius: 100%; padding: 0 6px 0 6px; font-size:16px; font-weight:900; background:yellow;">${
            routeList.indexOf(route) + 1
          }</div>`,
          position: new window.kakao.maps.LatLng(route.y, route.x), // 커스텀 오버레이를 표시할 좌표
          xAnchor: 0.5, // 컨텐츠의 x 위치
          yAnchor: 0, // 컨텐츠의 y 위치
        })
        customOverlay.setMap(map) // 지도에 올린다.
      })
    }
    for (let i = 0; i < routeList.length; i += 1) {
      if (routeList[i]) {
        const currLat: any = routeList[i].y
        const currLng: any = routeList[i].x
        if (i >= 1) {
          const prevLat: any = routeList[i - 1].y
          const prevLng: any = routeList[i - 1].x
          const linePath = [
            new window.kakao.maps.LatLng(prevLat, prevLng),
            new window.kakao.maps.LatLng(currLat, currLng),
          ]
          const polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#000000',
            strokeOpacity: 0.7,
            strokeStyle: 'dashed',
          })
          polyline.setMap(map)
        }
      }
    }
  }

  useEffect(() => {
    createMap()
    // setCreateMarker(false)
    // dispatch(deleteRouteList())
    // dispatch(deleteLocationList())
    console.log(createMarker)
    console.log('루트리스트 ', routeList)
    console.log('장소리스트 ', locationList)
  }, [locationList, routeList])

  return (
    <div id="settingRouteContainer">
      <div className="searchBox">
        <div className="inputBox">
          <input
            className="locationSearchBar"
            type="text"
            placeholder="검색어를 입력하세요."
            onKeyPress={e => {
              if (e.key === 'Enter') {
                searching()
              }
            }}
            onChange={changeWord}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} onClick={searching} className="searchIcon" />
        </div>
        <div className="locationListBox">
          {locationList === [] ? (
            <div>장소를 검색해 보세요.</div>
          ) : (
            <div>
              {locationList.map(location => {
                return (
                  <div className="locationBox" key={location.id}>
                    <div className="placeName">{location.place_name}</div>
                    <div className="adressName">{location.address_name}</div>
                    <button className="addButton" type="button" onClick={() => dispatch(AddRouteList(location))}>
                      장소추가
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mapBox">
        <div id="map" className="kakaomap" />
        <button className="nextButton" type="button">
          NEXT
        </button>
        <button className="deleteButton" type="button" onClick={() => deleteInformation()}>
          경로제거
        </button>
      </div>
    </div>
  )
}

export default SettingRoutePage
