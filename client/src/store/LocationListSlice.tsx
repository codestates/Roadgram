/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface locations {
  locationList: any[]
}

/* State 초기값 설정 */
const initialState: locations = {
  locationList: [],
}

const locationListSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    /* Action 설정 */
    getLocationList: (state: locations, { payload }: PayloadAction<Array<any>>) => {
      state.locationList = payload
    },
    deleteLocationList: (state: locations) => {
      state.locationList = []
    },
    resetKaKao: () => initialState
  },
})

export const { getLocationList, deleteLocationList, resetKaKao } = locationListSlice.actions
export default locationListSlice.reducer
