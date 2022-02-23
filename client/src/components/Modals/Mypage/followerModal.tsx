import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../..';
import { followerModal } from '../../../store/ModalSlice';
import './_followModal.scss';


function FollowerModal () {
  const dispatch = useDispatch();
  const { isFollowerModal } = useSelector((state: RootState) => state.modal);
  
  const closeModal = () => {
    dispatch(followerModal(!isFollowerModal));
  }

  return (
    <div className="follow-center-wrap">
      <div className="follow-background">
        <div className="follow-box">
          <button className="close-button" type="button" onClick={closeModal}>&times;</button>
          <div className="follow-title">팔로워</div>
          <div className="follows">lists</div>
        </div>
      </div>
    </div>
  )
}

export default FollowerModal;