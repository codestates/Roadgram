import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, } from '@fortawesome/free-solid-svg-icons'
import AWS, { S3 } from 'aws-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../..';
import { setImages } from '../../store/RouteListSlice';
import { setThumbnail } from '../../store/createPostSlice';

function UploadHold() {
  const { routeList } = useSelector((state: RootState) => state.routes);

  return (
    <div className="createpost_uploadhold_div">
    {routeList && true ?
    routeList.map((route, idx) => {
      return (
        <div className='createpost_uploadhold_route_div'>
        <div key={route.placeName} className='createpost_uploadhold_route_label'>
          {route.imageSrc === "" || !route.imageSrc 
          ? <div className="createpost_uploadhold_route_img">
              <FontAwesomeIcon icon={faPlus} className="createpost_plusicon" />
            </div>
          : 
          <img className='createpost_uploadhold_image_img' src={route.imageSrc} alt="route_image" />
          }
          <span className="createpost_uploadhold_route_span">{route.placeName}</span>
          </div>
        </div>
      )
    })
      : <div>등록한 경로를 찾을 수 없습니다.</div>
  }
    <div/>
    </div>
  ) 
}

export default UploadHold