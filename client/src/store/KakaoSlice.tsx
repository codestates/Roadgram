/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface locations {
  locationList: any[]
  routeList: any[]
}

/* State 초기값 설정 */
const initialState: locations = {
  locationList: [],
  routeList: [],
}

const kakaoSlice = createSlice({
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
    getRouteList: (state: locations, { payload }: PayloadAction<Array<any>>) => {
      if (state.routeList.length < 5) {
        state.routeList.push(payload)
      } else {
        alert('경로를 더이상 추가할 수 없습니다')
      }
    },
    deleteRouteList: (state: locations) => {
      state.routeList.pop()
    },
  },
})

export const { getLocationList, deleteLocationList, getRouteList, deleteRouteList } = kakaoSlice.actions
export default kakaoSlice.reducer
