/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface articles {
  // articleRecent: any[]
  // followArticle: any[]
  // searchArticle: any[]
  mainArticles:
    | {
        id?: number
        thumbnail?: string
        nickname?: string
        totalLike?: number
        totalComment?: number
        tags?: string[] | undefined | any
      }[]
    | []
    | any[]
}

/* State 초기값 설정 */
const initialState: articles = {
  mainArticles: [],
  // articleRecent: [],
  // followArticle: [],
  // searchArticle: []
}

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    /* Action 설정 */
    // getArticleRecent: (state: articles, { payload }: PayloadAction<Array<any>>) => {
    //   state.articleRecent = payload
    // },
    // getFollowArticle: (state: articles, { payload }: PayloadAction<Array<any>>) => {
    //   state.followArticle = payload
    // },
    // getSearchArticle: (state: articles, { payload }: PayloadAction<Array<any>>) => {
    //   state.searchArticle = payload
    // },
    getMainArticles: (state: articles, { payload }: PayloadAction<Array<any>>) => {
      state.mainArticles = payload
    },
  },
})

// export const { getArticleRecent, getFollowArticle, getSearchArticle } = articleSlice.actions
export const { getMainArticles } = articleSlice.actions
export default articleSlice.reducer
