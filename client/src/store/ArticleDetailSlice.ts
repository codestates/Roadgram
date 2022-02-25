/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { timestamp } from 'aws-sdk/clients/cloudfront';

/* State Type 설정 */
export interface articleDetails {
  userInfo: {
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
    totalLikes: number;
    totalComments: number;
    likedOrNot: boolean;
    comments?: {
      id: number;
      userId: number;
      profileImage: string;
      nickname: string;
      comment: string;
      createdAt: any;
    }[]
  }
}

/* State 초기값 설정 */
const initialState: articleDetails = {
  userInfo: {
    id: 0,
    nickname: '',
    profileImage: ''
  },
  articleInfo: {
    id: 0,
    content: '',
    roads: [],
    tags: [],
    totalLikes: 0,
    totalComments: 0,
    likedOrNot: false,
    comments: []
  }
}

const articleDetailSlice = createSlice({
  name: 'articleDetails',
  initialState,
  reducers: {
    /* Action 설정 */
    detailInfo: (state: articleDetails, { payload }: PayloadAction<any>) => {
      state.userInfo = payload.userInfo;
      state.articleInfo = payload.articleInfo;
    }
  }
})

// export const {  } = articleDetailSlice.actions;
export default articleDetailSlice.reducer;