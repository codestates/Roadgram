/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface tests {
  test2: any[]
}

/* State 초기값 설정 */
const initialState: tests = {
  test2: [],
}

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    /* Action 설정 */
    getTest: (state: tests) => {
      state.test2 = []
    },
  },
})

export const { getTest } = testSlice.actions
export default testSlice.reducer
