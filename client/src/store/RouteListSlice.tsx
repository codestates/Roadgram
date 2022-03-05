/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface routes {
  routeList: {
    placeName: string,
    addressName: string,
    x: number,
    y: number,
    imageSrc: string,
    order: number
  }[]
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
    addRouteList: (state: routes, { payload }: PayloadAction<any>) => {
      if(state.routeList.length > 0) {
        let duplicationCheck = false
        state.routeList.forEach((route) => {
          if(route.x === payload.x && route.y === payload.y) {
            duplicationCheck = true
          }
        })

        if(duplicationCheck) {
          alert("같은 경로를 중복해서 추가할 수 없습니다.");
          return;
        }
      }

      if (state.routeList.length < 5) {
        state.routeList.push(payload)
      } else {
        alert('경로는 5개까지 추가 가능합니다.')
      }
    },
    setImages: (state: routes, { payload }: PayloadAction<any>) => {
      state.routeList[payload.idx].imageSrc = payload.src;
    },
    deleteMakerSelected: (state: routes, { payload }: PayloadAction<any>) => {
      state.routeList = payload;
    },
    dragMakerChange: (state: routes, { payload }: PayloadAction<any>) => {
      const dragIdx = payload[0].idx;
      const enterIdx = payload[1].idx;
      // 드래그 한 값을 서로 반대로 넣어줌
      state.routeList[dragIdx] = payload[1].value;
      state.routeList[enterIdx] = payload[0].value;
    },
    resetRouteList: () => initialState
  },
})

export const { getRouteList, addRouteList, setImages, deleteMakerSelected, dragMakerChange, resetRouteList } = routeListSlice.actions
export default routeListSlice.reducer
