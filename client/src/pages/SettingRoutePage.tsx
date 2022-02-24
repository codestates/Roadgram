import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

function SettingRoutePage() {
  const [word, setWord] = useState('')

  const changeWord = (e: any) => {
    setWord(e.target.value)
    console.log(e.target.value)
  }

  const searching = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_KAKAO_API_URL}/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000&query=${word}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REST_API_KEY}`,
        },
      },
    )
    console.log(response.data.documents)
  }

  return (
    <div className="settingRouteContainer">
      <div className="inputDiv">
        <input className="searchBar" type="text" placeholder="검색어를 입력하세요." onChange={changeWord} />
        <FontAwesomeIcon icon={faMagnifyingGlass} onClick={searching} className="searchIcon" />
      </div>
    </div>
  )
}

export default SettingRoutePage
