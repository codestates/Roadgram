import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../..';
// import { followings } from '../../../store/FollowSlice';
import { followingModal } from '../../../store/ModalSlice';
import './_followModal.scss';


function FollowingModal () {
  const dispatch = useDispatch();
  const { isFollowingModal } = useSelector((state: RootState) => state.modal);
  const {followingList} = useSelector((state: RootState) => state.follow);
  // const { id, nickname, profileImage } = useSelector((state: RootState) => state.follow)
  const { userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  const closeModal = () => {
    dispatch(followingModal(!isFollowingModal));
  };

  return (
    <div className="follow-center-wrap">
      <div className="follow-background">
        <div className="follow-box">
          <button className="close-button" type="button" onClick={closeModal}>&times;</button>
          <div className="follow-title">팔로잉</div>
          <div className="follows">lists</div>
          {followingList?.map((each) => {
            return (
            <div className="follow_profile_div" key={each.id}>
              <img alt="profile_image" src={each.profileImage} className="follow_profile_image"/>
              <span>{each.nickname}</span>
              <button type="button">팔로우</button>
            </div>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}

export default FollowingModal;
