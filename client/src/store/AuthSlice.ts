/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { persistor } from '../index'
/* State Type 설정 */

export interface auth {
  isLogin: boolean
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
    accessToken?: string
    refreshToken?: string
  },
}
/* State 초기값 설정 */
const initialState: auth = {
  isLogin: false,
  userInfo: {}
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* Action 설정 */
    login: (state: auth,  action: PayloadAction<object>) => {
      console.log("payload ====" , action.payload);
      state.userInfo = action.payload
      // state.accessToken = action.payload
      state.isLogin = true
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
