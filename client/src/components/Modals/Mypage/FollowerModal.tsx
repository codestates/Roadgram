import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../..'
import { followerModal } from '../../../store/ModalSlice'
import { update } from '../../../store/UserInfoSlice'
import './_followModal.scss'


function FollowerModal () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isFollowerModal } = useSelector((state: RootState) => state.modal)
  const {followerList} = useSelector((state: RootState) => state.follow)
  const state = useSelector((state: RootState) => state)
  // const { userInfo, accessToken } = useSelector((state: RootState) => state.auth);
  
  console.log("followerList === ", followerList)
  console.log("state === ", state)
  const closeModal = () => {
    dispatch(followerModal(!isFollowerModal))
  }

  async function moveToUserPage(id: any) {
    closeModal();
    const page = 1;
    await axios
    .get(`${process.env.REACT_APP_API_URL}/users/userinfo?user=${id}&page=${page}`)
    .then((res) => {
      dispatch(update(res.data.data)); // userInfo 정보 update
      navigate('/userinfo');
    })
    .catch(console.log);
  }

  return (
    <div className="follow-center-wrap">
        <div className="follow-box">
          <div className="follow-background">
            <span className="follow-title">팔로워</span>
            <button className="close-button" type="button" onClick={closeModal}>&times;</button>
          </div>
          <hr/>
          <div className="follows">
          {followerList?.map((each) => {
            return (
            <li 
              className="follow_profile_list" 
              key={each.id} 
              onClick={()=> {moveToUserPage(each.id)}} 
              onKeyDown={()=> {moveToUserPage(each.id)}}
            >
              <img alt="profile_image" src={each.profileImage} className="follow_profile_image"/>
              <span>{each.nickname}</span>
            </li>
            )
          })
          }
        </div>
      </div>
    </div>
  )
}

export default FollowerModal;
