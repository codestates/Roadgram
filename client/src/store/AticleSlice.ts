/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { persistor } from '../index'

/* State Type 설정 */
export interface articles {
  articleRecent: any[]
}

/* State 초기값 설정 */
const initialState: articles = {
  articleRecent: [],
}

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    /* Action 설정 */
    getArticleRecent: (state: articles, { payload }: PayloadAction<Array<any>>) => {
      state.articleRecent = payload
    },
  },
})

export const { getArticleRecent } = articleSlice.actions
export default articleSlice.reducer
