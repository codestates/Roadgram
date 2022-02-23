import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../..';
// import { followings } from '../../../store/FollowSlice';
import { followingModal } from '../../../store/ModalSlice';
import './_followModal.scss';


function FollowingModal () {
  const dispatch = useDispatch();
  const { isFollowingModal } = useSelector((state: RootState) => state.modal);
  // const { id, nickname, profileImage } = useSelector((state: RootState) => state.follow)
  const { userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  // console.log(userInfo);

  const closeModal = () => {
    dispatch(followingModal(!isFollowingModal));
  };

  // const followingList = () => {
  //   // const params = { id, loginMethod, accessToken }
  //   dispatch(followings({ id, loginMethod, accessToken }));
  // }


  return (
    <div className="follow-center-wrap">
      <div className="follow-background">
        <div className="follow-box">
          <button className="close-button" type="button" onClick={closeModal}>&times;</button>
          <div className="follow-title">팔로잉</div>
          <div className="follows">lists</div>
        </div>
      </div>
    </div>
  )
}

export default FollowingModal;
