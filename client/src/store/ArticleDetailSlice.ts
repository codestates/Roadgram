/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface articleDetails {
  writerInfo: {
    id: number;
    nickname: string;
    profileImage: string;
  },
  articleInfo: {
    id: number;
    content: string;
    roads: {
      imageSrc: string;
      location: string;
    }[];
    tags?: string[] | undefined | any;
    totalLike: number;
    totalComment: number;
    likedOrNot: boolean;
    createdAt: Date | null;
    comments?: {
      id: number;
      userId: number;
      profileImage: string;
      nickname: string;
      comment: string;
      createdAt: Date;
    }[];
  }
}

/* State 초기값 설정 */
const initialState: articleDetails = {
  writerInfo: {
    id: 0,
    nickname: '',
    profileImage: ''
  },
  articleInfo: {
    id: 0,
    content: '',
    roads: [],
    tags: [],
    totalLike: 0,
    totalComment: 0,
    likedOrNot: false,
    createdAt: null,
    comments: []
  }
}

const articleDetailSlice = createSlice({
  name: 'articleDetails',
  initialState,
  reducers: {
    /* Action 설정 */
    detailInfo: (state: articleDetails, { payload }: PayloadAction<any>) => {
      state.writerInfo = payload.userInfo;
      state.articleInfo = payload.articleInfo;
    },
    resetArticleDetail: () => initialState
  }
})

export const { detailInfo, resetArticleDetail } = articleDetailSlice.actions;
export default articleDetailSlice.reducer;