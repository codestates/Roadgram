import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import './_followModal.scss';


function FollowingModal (isList: object[]) {
  const dispatch = useDispatch();
  
  console.log(isList);
  
  return (
    <div className="follow-center-wrap">
      <div className="follow-background">
        <div className="follow-box">
          <button className="close-button" type="button">&times;</button>
          <div className="follow-title">팔로우</div>
          <div className="follows">lists</div>
        </div>
      </div>
    </div>
  )
}

export default FollowingModal;
