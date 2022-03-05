/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
/* State Type 설정 */
export interface modals {
  isFollowingModal: boolean
  isFollowerModal: boolean
  isLogoutModal: boolean
  isWithdrawalModal: boolean
  isArticleDeleteModal: boolean
}

const initialState: modals = {
  isFollowingModal: false,
  isFollowerModal: false,
  isLogoutModal: false,
  isWithdrawalModal: false,
  isArticleDeleteModal: false
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /* Action 설정 */
    followingModal: (state: modals, { payload }: PayloadAction<boolean>) => {
      state.isFollowingModal = payload;
    },
    followerModal: (state: modals, { payload }: PayloadAction<boolean>) => {
      state.isFollowerModal = payload;
    },
    logoutModal: (state: modals, { payload }: PayloadAction<boolean>) => {
      state.isLogoutModal = payload;
    },
    articleDeleteModal: (state: modals, { payload }: PayloadAction<boolean>) => {
      state.isArticleDeleteModal = payload;
    },
    withdrawalModal: (state: modals, { payload }: PayloadAction<boolean>) => {
      state.isWithdrawalModal = payload;
    },
    resetModal: () => initialState
  },
})

export const { followingModal, followerModal, logoutModal, articleDeleteModal, withdrawalModal, resetModal } = modalSlice.actions;
export default modalSlice.reducer;