/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface comments {
  commentInfo: {
    id: number;
    userId: number;
    profileImage: string;
    nickname: string;
    comment: string;
    createdAt: Date | null;
  }[] | [] | any[]
}

/* State 초기값 설정 */
const initialState: comments = {
  commentInfo: []
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    /* Action 설정 */
    getComments: (state: comments, { payload }: PayloadAction<any>) => {
      state.commentInfo = payload;
    },
    addComment: (state: comments, { payload }: PayloadAction<any>) => {
      if (state.commentInfo === undefined) {
        state.commentInfo = [payload];
      } else {
        state.commentInfo = [...state.commentInfo, payload];
      }    
    },
    addNextPageComment: (state: comments, { payload }: PayloadAction<any>) => {
      state.commentInfo = [...state.commentInfo, ...payload];
    },
    removeComment: (state: comments, { payload }: PayloadAction<any>) => {
      state.commentInfo = state.commentInfo.filter(el => el.id !== payload)
    },
    // changeComment: (state: comments, { payload }: PayloadAction<any>) => {
    //   const { id, comment, createdAt, userId } = payload;
    //   state.commentInfo.map({

    //   })
    //   state.commentInfo = state.commentInfo.filter(el => 
    //     el.id !== id
    //   );
    // },
    resetComments: (state: comments) => {
      state.commentInfo = []
    }
  }
})

export const { getComments, addComment, removeComment, resetComments, addNextPageComment } = commentsSlice.actions;
export default commentsSlice.reducer;