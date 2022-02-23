/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { persistor } from '../index'
/* State Type 설정 */

export interface followList {
  id?: number,
  nickname?: string,
  profileImage?: string
}

export interface followInfo {
  followingList?: followList[],
  followerList?: followList[]
}
/* State 초기값 설정 */
const initialState: followInfo = {
  followingList: [],
  followerList: []
}

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    /* Action 설정 */
    getFollowing: (state: followInfo,  {payload}: PayloadAction<[]>) => {
      state.followingList = payload
    },
    getFollower: (state: followInfo,  {payload}: PayloadAction<[]>) => {
      state.followerList = payload;
    },
  },
})

export const { getFollowing, getFollower } = followSlice.actions
export default followSlice.reducer
