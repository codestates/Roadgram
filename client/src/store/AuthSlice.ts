/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistor } from '../index'
/* State Type 설정 */
export interface auth {
  isLogin: boolean
  userInfo: {
    id?: number
    nickname?: string
    email?: string
    password?: string
    status_message?: string
    profile_image?: string
    total_follower?: number
    total_following?: number
    login_method?: number
    refresh_token?: number
    created_at?: Date
  }
}
/* State 초기값 설정 */
const initialState: auth = {
  isLogin: false,
  userInfo: {},
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* Action 설정 */
    login: (state: auth) => {
      state.isLogin = true
    },
    logout: (state: auth) => {
      state.isLogin = false
      /* 로그아웃시 persistStore의 데이터를 전부 삭제 */
      setTimeout(() => persistor.purge(), 500)
    },
    getUserInfo: (state: auth, { payload }: PayloadAction<object>) => {
      state.userInfo = payload
    },
  },
})

export const { login, logout, getUserInfo } = authSlice.actions
export default authSlice.reducer
