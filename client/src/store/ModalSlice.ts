/* Store import */
import { createSlice } from '@reduxjs/toolkit'
/* State Type 설정 */
export interface modal {
  isModal: boolean
}

const initialState: modal = {
  isModal: false
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /* Action 설정 */
    openModal: (state: modal) => {
      state.isModal = true;
    },
    closeModal: (state: modal) => {
      state.isModal = false;
    }
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer