import React from 'react'
import '../styles/components/_track.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '..'

function Track() {
  const { articleInfo } = useSelector((state: RootState) => state.articleDetails)
  // console.log(articleInfo)

  return (
    <div className="track-container">
      <div>장소정보</div>
      <div className="marker_div">
        <FontAwesomeIcon className="markerImg" icon={faLocationDot} />
        <div>
          <div className="marker_span">서울 남산 타워</div>
          <div>서울시 노원구 상계동 22-12</div>
        </div>
      </div>
      <FontAwesomeIcon className="ellipsis" icon={faEllipsisVertical} />
    </div>
  )
}

export default Track
