/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface articles {
  mainArticles: {
    id: number,
    userId:number,
    thumbnail?: string,
    profileImage?: string,
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
    },
    addMainArticles: (state: articles, { payload }: PayloadAction<Array<any>>) => {
      state.mainArticles = [...state.mainArticles, ...payload]
    },
    resetArticle: (state: articles) => { state.mainArticles = []; state.tag = "" }
  },
})
export const { getMainArticles, setTag, addMainArticles, resetArticle } = articleSlice.actions
export default articleSlice.reducer
