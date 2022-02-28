import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { RootState } from '..'
import { getLocationList, getPagenationList } from '../store/KakaoSlice'

// 글로벌로 kakao를 선언해주지 않으면 앱이 인식하지 못한다.
declare global {
  interface Window {
    kakao: any
  }
}

function SettingRoutePage() {
  // // 검색결과 배열에 담아줌
  // const [searchPlace, setSearchPlace] = useState('') // 검색어 state
  // const [isClick, setIsClick] = useState(false) // 검색버튼 클릭 여부
  // const dispatch = useDispatch()
  // const { locationList, paginationList } = useSelector((state: RootState) => state.locations)

  // const changeWord = (e: any) => {
  //   setSearchPlace(e.target.value)
  // }
  // console.log(searchPlace)

  // useEffect(() => {
  //   const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })
  //   const markers = []
  //   const container = document.getElementById('myMap')
  //   const options = {
  //     center: new window.kakao.maps.LatLng(37.51207412593136, 127.05902969025047),
  //     level: 3,
  //   }
  //   const map = new window.kakao.maps.Map(container, options)

  //   const ps = new window.kakao.maps.services.Places()

  //   ps.keywordSearch(searchPlace, placesSearchCB)

  //   function placesSearchCB(data: any, status: any, pagination: any) {
  //     if (status === window.kakao.maps.services.Status.OK) {
  //       dispatch(getLocationList(data)) // 검색결과 데이터를 locationList에 넣어줌
  //       dispatch(getPagenationList(pagination))
  //       const bounds = new window.kakao.maps.LatLngBounds()
  //       for (let i = 0; i < locationList.length; i += i) {
  //         displayMarker(locationList[i])
  //         bounds.extend(new window.kakao.maps.LatLng(locationList[i].y, locationList[i].x))
  //       }

  //       map.setBounds(bounds)
  //       // 페이지 목록 보여주는 displayPagination() 추가
  //       displayPagination(paginationList)
  //     }
  //   }

  //   // 검색결과 목록 하단에 페이지 번호 표시
  //   function displayPagination(pagination: any) {
  //     const paginationEl = document.getElementById('pagination')!
  //     const fragment = document.createDocumentFragment()
  //     let i

  //     // 기존에 추가된 페이지 번호 삭제
  //     while (paginationEl.hasChildNodes()) {
  //       paginationEl.removeChild(paginationEl.lastChild!)
  //     }

  //     for (i = 1; i <= pagination.last; i += i) {
  //       const el: any = document.createElement('a')
  //       el.href = '#'
  //       el.innerHTML = i

  //       if (i === pagination.current) {
  //         el.className = 'on'
  //       } else {
  //         el.onclick = (function (i) {
  //           return function () {
  //             pagination.gotoPage(i)
  //           }
  //         })(i)
  //       }

  //       fragment.appendChild(el)
  //     }
  //     paginationEl.appendChild(fragment)
  //   }

  //   function displayMarker(place: any) {
  //     const marker = new window.kakao.maps.Marker({
  //       map,
  //       position: new window.kakao.maps.LatLng(place.y, place.x),
  //     })

  //     window.kakao.maps.event.addListener(marker, 'click', function () {
  //       infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`)
  //       infowindow.open(map, marker)
  //     })
  //   }
  // }, [isClick])

  // return (
  //   <div>
  //     <input type="search" onChange={changeWord} />
  //     <button type="button" onClick={() => setIsClick(true)}>
  //       검색
  //     </button>
  //     <div
  //       id="myMap"
  //       style={{
  //         width: '500px',
  //         height: '500px',
  //       }}
  //     />
  //     <div id="result-list">
  //       {locationList.map((item: any, i) => (
  //         <div key={item.id} style={{ marginTop: '20px' }}>
  //           <span>{i + 1}</span>
  //           <div>
  //             <h5>{item.place_name}</h5>
  //             {item.road_address_name ? (
  //               <div>
  //                 <span>{item.road_address_name}</span>
  //                 <span>{item.address_name}</span>
  //               </div>
  //             ) : (
  //               <span>{item.address_name}</span>
  //             )}
  //             <span>{item.phone}</span>
  //           </div>
  //         </div>
  //       ))}
  //       <div id="pagination" />
  //     </div>
  //   </div>
  // )

  // const [word, setWord] = useState('')
  // const [isClick, setIsClick] = useState(false)
  // const dispatch = useDispatch()
  // const { locationList } = useSelector((state: RootState) => state.locations)

  // const sliceLatLng = (num: number): number => {
  //   const str = String(num)
  //   const [head, tail] = str.split('.')
  //   let slicedTail
  //   if (head.length === 2) {
  //     slicedTail = tail.substring(0, 6)
  //   } else {
  //     slicedTail = tail.substring(0, 7)
  //   }
  //   const combineHeadTail = `${head}.${slicedTail}`
  //   return Number(combineHeadTail)
  // }

  // const changeWord = (e: any) => {
  //   setWord(e.target.value)
  //   console.log(word)
  // }

  // useEffect(() => {
  //   // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
  //   const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })

  //   const mapContainer = document.getElementById('map') // 지도를 표시할 div
  //   const mapOption = {
  //     center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  //     level: 3, // 지도의 확대 레벨
  //   }

  //   // 지도를 생성합니다
  //   const map = new window.kakao.maps.Map(mapContainer, mapOption)

  //   // 장소 검색 객체를 생성합니다
  //   const ps = new window.kakao.maps.services.Places()

  //   // 키워드로 장소를 검색합니다
  //   if (isClick) {
  //     ps.keywordSearch(word, placesSearchCB)
  //   }

  //   // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  //   function placesSearchCB(data: any, status: any, pagination: any) {
  //     console.log(data)
  //     dispatch(getLocationList(data))
  //     console.log('잘 나오는가....', locationList)
  //     if (status === window.kakao.maps.services.Status.OK) {
  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
  //       // LatLngBounds 객체에 좌표를 추가합니다
  //       // const bounds = new window.kakao.maps.LatLngBounds()
  //       // console.log(bounds)
  //       displayPlaces(data)
  //       displayPagination(pagination)
  //       //   // bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
  //       // console.log('okokok')
  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  //       // map.setBounds(bounds)
  //     } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
  //       alert('검색 결과가 존재하지 않습니다.')
  //     } else if (status === window.kakao.maps.services.Status.ERROR) {
  //       alert('검색 결과 중 오류가 발생했습니다.')
  //     }
  //   }

  //   // 검색 결과 목록과 마커를 표출하는 함수입니다
  //   function displayPlaces(places: any) {
  //     const listEl = document.getElementById('placesList')
  //     const menuEl = document.getElementById('menu_wrap')
  //     const fragment = document.createDocumentFragment()
  //     const bounds = new window.kakao.maps.LatLngBounds()
  //     const listStr = ''

  //     // 검색 결과 목록에 추가된 항목들을 제거합니다
  //     // removeAllChildNods(listEl)
  //   }
  // }, [isClick])

  // return (
  //   <div>
  //     <input type="search" onChange={changeWord} />
  //     <button type="button" onClick={() => setIsClick(!isClick)}>
  //       검색
  //     </button>
  //     <div id="map" style={{ width: '500px', height: '400px' }} />
  //   </div>
  // )

  /* ------------------------------------------------- */

  const [word, setWord] = useState('')
  const [createMarker, setCreateMarker] = useState(false)
  const dispatch = useDispatch()
  const { locationList } = useSelector((state: RootState) => state.locations)

  const changeWord = (e: any) => {
    setWord(e.target.value)
    console.log(e.target.value)
    console.log(word)
  }

  const searching = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_KAKAO_API_URL}/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000&query=${word}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_REST_API_KEY}`,
        },
      },
    )
    setCreateMarker(true)
    dispatch(getLocationList(response.data.documents))
    console.log(response.data.documents)
  }

  // 카카오맵을 생성하는 함수
  const createMap = () => {
    const mapContainer = document.getElementById('map') // 지도를 표시할 div
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.56682, 126.97865), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
      mapTypeId: window.kakao.maps.MapTypeId.ROADMAP, // 지도종류
    }
    // 지도를 생성한다
    const map = new window.kakao.maps.Map(mapContainer, mapOption)
    console.log(createMarker)
    if (createMarker) {
      // eslint-disable-next-line array-callback-return
      locationList.map(location => {
        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new window.kakao.maps.services.Geocoder()

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(location.road_address_name, function (result: any, status: any) {
          // 정상적으로 검색이 완료됐으면
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

            // 결과값으로 받은 위치를 마커로 표시합니다
            const marker = new window.kakao.maps.Marker({
              map,
              position: coords,
            })

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;">
            <div>${location.place_name}</div><div>${location.road_address_name}</div>
            </div>`,
            })
            infowindow.open(map, marker)

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords)
          }
        })
      })
      console.log(map.getCenter())
    }
  }

  useEffect(() => {
    createMap()
  }, [locationList])

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
                    <button className="addButton" type="button">
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
        <Link to="/createpost">
        <button className="nextButton" type="button">
          NEXT
        </button>
        </Link>
      </div>
    </div>
  )
}

export default SettingRoutePage
