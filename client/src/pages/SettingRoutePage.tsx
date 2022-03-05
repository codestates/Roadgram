import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faMagnifyingGlass, faMinusCircle, faShoePrints } from '@fortawesome/free-solid-svg-icons'
import { } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { RootState } from '..'
import { getLocationList, deleteLocationList, locations, resetKaKao } from '../store/LocationListSlice'
import { getRouteList, addRouteList, deleteMakerSelected, resetRouteList, dragMakerChange } from '../store/RouteListSlice'
import { resetUserInfo } from '../store/UserInfoSlice'
import markerImg from '../images/bluelocation.png'
import line from '../images/line.png'
import { resetCreatePost } from '../store/createPostSlice'

// 글로벌로 kakao를 선언해주지 않으면 앱이 인식하지 못한다.
declare global {
  interface Window {
    kakao: any
  }
}

function SettingRoutePage() {
  const [word, setWord] = useState('') // 검색어 state
  const [createMarker, setCreateMarker] = useState(false) // 마커 생성여부 state
  const [isSearch, setIsSearch] = useState("검색된 장소가 없습니다.") // 검색여부 state
  const [dragIdx, setDragIdx] = useState(-1);
  const [enterIdx, setEnterIdx] = useState(-1);
  const { locationList } = useSelector((state: RootState) => state.locations)
  const { routeList } = useSelector((state: RootState) => state.routes)
  const [coordinate, setCoordinate] = useState([37.56682, 126.97865])
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // 스크롤 초기화
  useEffect(()=>{
    document.documentElement.scrollTop=0;
  },[])

  // 지도의 범위를 설정하는 함수를 불러온다
  const bounds = new window.kakao.maps.LatLngBounds()
  // 루트설정 마커 이미지의 주소
  // https://i.ibb.co/0cVXf0y/location3.png -> 원 안에 표시 있는 이미지
  // https://i.ibb.co/VBqLpfN/location2.png -> 원 안에 표시 없는 이미지
  // https://i.ibb.co/PtYZPQQ/location-copy.png -> 원 크기 키운 이미지
  // https://i.ibb.co/4FhqrYR/location-copy.png -> 초록색 이미지
  // https://i.ibb.co/wgFHJDm/location-copy.png -> 갈색 이미지
  const markerImageUrl = 'https://i.ibb.co/VBqLpfN/location2.png'
  const markerImageSize = new window.kakao.maps.Size(55, 55) // 마커 이미지의 크기
  const markerImageOptions = {
    offset: new window.kakao.maps.Point(30, 50), // 마커 좌표에 일치시킬 이미지 안의 좌표
  }
  // 루트설정 마커 이미지를 생성한다
  const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions)

  useEffect(() => {
    createMap(coordinate);
  }, [locationList, routeList])

  
  // 검색창(input 태그) 입력값 받아와서 'word' State에 저장
  const changeWord = (e: any) => {
    setIsSearch("");
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
      setIsSearch('검색 결과가 존재하지 않습니다.') // 나중에 모달로 바꾸자...
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      setIsSearch('검색 결과 중 오류가 발생했습니다.') // 나중에 모달로 바꾸자...
    }
  }

  

  // 카카오맵을 생성하는 함수
  const createMap = (coordinate: Array<any>) => {
    // 바운스 함수

    const mapBounds = () => {
      map.setBounds(bounds);
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
        // window.kakao.maps.event.addListener(marker, 'click', function () {
        //   alert('마커를 클릭했습니다!')
        // })

        bounds.extend(new window.kakao.maps.LatLng(location.y, location.x))
        // 인포윈도우로 장소에 대한 설명을 표시합니다
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
            ${location.place_name}
          </div>`,
        })
        // <div>${location.address_name}</div>
        if(location.x === coordinate[1] && location.y === coordinate[0]) {
          infowindow.open(map, marker);
        }

        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
          infowindow.open(map, marker)
        })
        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close()
        })
      })
      mapBounds() // 지도의 범위를 재설정한다
    }

    if (routeList.length >= 1) {
      routeList.forEach(route => {
        const routeMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(route.y, route.x), // 마커의 좌표
          image: markerImage, // 마커의 이미지
          map, // 마커를 표시할 지도 객체
        })
        
        bounds.extend(new window.kakao.maps.LatLng(route.y, route.x));

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
          <div 
          <div style=
          "width:150px;
          text-align:center;
          padding:6px 0;
          font-weight: 600;
          font-size: 1.2rem;
          z-index: 999;
          // border-radius: 1rem;
          ">
          ${route.placeName}
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
            ${routeList.indexOf(route) + 1}
          </div>`,
          position: new window.kakao.maps.LatLng(route.y, route.x), // 커스텀 오버레이를 표시할 좌표
          xAnchor: 0.6, // 컨텐츠의 x 위치
          yAnchor: 0.1, // 컨텐츠의 y 위치
        })
        customOverlay.setMap(map) // 지도에 올린다.
      })
      mapBounds();
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
            strokeColor: 'black',
            strokeOpacity: 0.7,
            strokeStyle: 'dashed',
          })
          polyline.setMap(map)
        }
      }
    }
  }

  const addRoute = (location: any) => {
    const routeInfo = {
      placeName: location.place_name,
      addressName: location.address_name,
      x: location.x,
      y: location.y,
      imageSrc: '',
      order: routeList.length + 1,
    }
    dispatch(addRouteList(routeInfo))
  }

  const deleteSelected = (idx: number) => {
    const newRouteList = routeList.filter((_, index) => idx !== index)
    dispatch(deleteMakerSelected(newRouteList));
  }

  const resetPostInfo = () => {
    dispatch(resetCreatePost());
    dispatch(resetKaKao());
    dispatch(resetRouteList());
  }

  const cancelPosting = () => {
    if(window.confirm("취소하시면 작성하신 내용을 모두 잃게됩니다. 계속 하시겠습니까?")) {
      resetPostInfo();
      navigate('/main');
    }
  }

  const moveToCreatePost = () => {
    if(routeList.length > 0) {
      navigate('/createpost');
    } else {
      alert("경로를 하나 이상 추가 해주시기 바랍니다.");
    }
  }

  const dragStartHandler = (e: any, idx: number) => {
    // 드래그 idx 저장
    console.log("drag 시작");
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move'; 
  };
  
  const dragEnterHandler = (e:any, idx: number) => {
    // 유효한 zone에 enter시 idx값 저장
      setEnterIdx(idx); 
  }

  const dragEndHandler = (e:any) => {
    if(dragIdx !== enterIdx) {
      // 드래그 idx값과 enter idx값이 다를 경우만 변경 처리
      const changeRouteList = [
        { idx: dragIdx, value: routeList[dragIdx] },
        { idx: enterIdx, value: routeList[enterIdx]}
      ];
      dispatch(dragMakerChange(changeRouteList));
    }
      // drag 관련 idx값 초기화
      setDragIdx(-1)
      setEnterIdx(-1);  
  };

  const clickLocation = (location: any) => {
      createMap([location.y, location.x]);
  }

  return (
    <div id="settingRouteContainer">
      <div className="searchBox">
      <h1>경로 설정</h1>
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
          {isSearch !== "" ? (
            <div className="noplace">{isSearch}</div>
          ) : (
            <div>
              {locationList.map(location => {
                return (
                  <li className="locationBox" key={location.id} onClick={()=> clickLocation(location)} onKeyDown ={() => clickLocation(location)}>
                    <div className="placeName">{location.place_name}</div>
                    <div className="addressName">{location.address_name}</div>
                    <div className="locationDiv">
                      <a className="locationAtag" href={location.place_url} target="_blank" rel="noreferrer">
                        <button className="detailButton" type="button">상세보기</button>
                      </a>
                      <button className="addButton" type="button" onClick={() => addRoute(location)}>장소추가</button>
                    </div>
                  </li>
                )
              })}
            </div>
          )}
        </div>
        <div className="buttonDiv">
          <button className="cancelButton" type="button" onClick={cancelPosting}>작성 취소</button>
          <button className="nextButton" type="button" onClick={moveToCreatePost}>다음 페이지</button>
        </div>
      </div>
      <div className="mapBox">
        <div id="map" className="kakaomap" />

        <div className={`${routeList.length === 0 ? "selectedRouteBox_hidden" : "selectedRouteBox"}`}>
        {routeList.length > 0 
          ? routeList.map((route, idx) => {
            return (
              <>
              <div className={`${enterIdx === idx ? "marker_div convex" : "marker_div"}`}>
                <div 
                  draggable="true" 
                  className="marker_img_div"
                  onDragStart={(e) => {dragStartHandler(e, idx)}}
                  onDragEnter={(e) => {dragEnterHandler(e, idx)}}
                  onDragEnd={(e) => {dragEndHandler(e)}}
                >
                <FontAwesomeIcon 
                  className="markerImg" 
                  icon={faLocationDot} 
                  onClick={() => {deleteSelected(idx)}} 
                />
                <FontAwesomeIcon className="cancelImg" icon={faMinusCircle} onClick={() => {deleteSelected(idx)}}/>
                </div>
                <span className="marker_span">{route.placeName}</span>
              </div>
              <div className={idx === routeList.length -1 ? "footstep_div hidden" : "footstep_div"}>
                <FontAwesomeIcon className={idx === routeList.length -1 ? "footstep hidden" : "footstep"} icon={faShoePrints} />
                <FontAwesomeIcon className={idx === routeList.length -1 ? "footstep hidden" : "footstep"} icon={faShoePrints} />
              </div>
              </>
            )}) 
          : null
        }
        </div>
      </div>
    </div>
  )
}

export default SettingRoutePage
