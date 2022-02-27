/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface routes {
  routeList: any[]
}

/* State 초기값 설정 */
const initialState: routes = {
  routeList: [],
}

const routeListSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    /* Action 설정 */
    getRouteList: (state: routes) => {
      state.routeList = []
    },
    AddRouteList: (state: routes, { payload }: PayloadAction<Array<any>>) => {
      if (state.routeList.length < 5) {
        state.routeList.push(payload)
      } else {
        alert('경로를 더이상 추가할 수 없습니다')
      }
    },
    deleteRouteList: (state: routes) => {
      state.routeList.pop()
    },
  },
})

export const { getRouteList, AddRouteList, deleteRouteList } = routeListSlice.actions
export default routeListSlice.reducer
