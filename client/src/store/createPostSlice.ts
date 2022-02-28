/* Store import */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/* State Type 설정 */
export interface createPost {
  content: string,
  thumbnail: string,
  images: {
    order: number,
    imgSrc: string,
    location: string,
  }[],
  tagsInfo: {
    order: number,
    tagName: string
  }[]
}

/* State 초기값 설정 */
const initialState: createPost = {
  content: "",
  thumbnail: "",
  images: [],
  tagsInfo: []
}

const createPostSlice = createSlice({
  name: 'createPost',
  initialState,
  reducers: {
    /* Action 설정 */
    setTagsInfo: (state: createPost, { payload }: PayloadAction<any>) => {
      state.tagsInfo = payload;
    },
    setThumbnail: (state: createPost, { payload }: PayloadAction<any>) => {
      state.thumbnail = payload;
    },
    setContent: (state: createPost, { payload }: PayloadAction<any>) => {
      state.content = payload;
    },
    setImages: (state: createPost, { payload }: PayloadAction<any>) => {
      state.images = payload;
    },
    resetCreatePost: () => initialState
  },
})

export const { setTagsInfo, setThumbnail, setContent, setImages, resetCreatePost } = createPostSlice.actions
export default createPostSlice.reducer
