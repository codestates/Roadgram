/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { persistor } from '../index'

/* State Type 설정 */
export interface articles {
  mainArticles: {
    id?: number,
    thumbnail?: string,
    nickname?: string,
    totalLike?: number,
    totalComment?: number
    tags?: string[] | undefined | any
  }[] | [] | any[],
  tag: string
}

/* State 초기값 설정 */
const initialState: articles = {
  mainArticles: [],
  tag: ""
}

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    getMainArticles: (state: articles, { payload }: PayloadAction<Array<any>>) => {
      state.mainArticles = payload
    },
    setTag: (state: articles, { payload }: PayloadAction<string>) => {
      state.tag = payload
    }
  },
})
export const { getMainArticles, setTag } = articleSlice.actions
export default articleSlice.reducer
