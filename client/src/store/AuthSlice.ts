/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { persistor } from '../index'
/* State Type 설정 */

export interface auth {
  isLogin: boolean,
  accessToken?: string,
  refreshToken?: string
  userInfo: {
    id?: number
    nickname?: string
    email?: string
    password?: string
    statusMessage?: string
    profileImage?: string
    totalFollower?: number
    totalFollowing?: number
    loginMethod?: number
  },
}
/* State 초기값 설정 */
const initialState: auth = {
  isLogin: false,
  userInfo: {
    loginMethod: 0
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* Action 설정 */
    login: (state: auth,  action: PayloadAction<auth>) => {
      const {accessToken, refreshToken, userInfo} = action.payload;
      state.userInfo = userInfo;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLogin = true;
    },
    logout: (state: auth) => {
      state.isLogin = false
      /* 로그아웃시 persistStore의 데이터를 전부 삭제 */
      setTimeout(() => persistor.purge(), 500)
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
