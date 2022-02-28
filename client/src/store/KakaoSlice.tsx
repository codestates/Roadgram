/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface locations {
  locationList: any[]
  paginationList: object
}

/* State 초기값 설정 */
const initialState: locations = {
  locationList: [],
  paginationList: {},
}

const kakaoSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    /* Action 설정 */
    getLocationList: (state: locations, { payload }: PayloadAction<Array<any>>) => {
      state.locationList = payload
    },
    getPagenationList: (state: locations, { payload }: PayloadAction<object>) => {
      state.paginationList = payload
    },
    resetKaKao: () => initialState
  },
})

export const { getLocationList, getPagenationList, resetKaKao } = kakaoSlice.actions
export default kakaoSlice.reducer
