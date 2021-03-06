/* Library import */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore, PERSIST } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import reportWebVitals from './reportWebVitals'
/* Component import */
import App from './App'

/* Store import */
import authSlice, { auth } from './store/AuthSlice'
import userInfoSlice, { UserInfo } from './store/UserInfoSlice'
import modalSlice, { modals } from './store/ModalSlice'
import articleSlice, { articles } from './store/ArticleSlice'
import followSlice, { followInfo } from './store/FollowSlice'
import locationListSlice, { locations } from './store/LocationListSlice'
import articleDetailSlice, { articleDetails } from './store/ArticleDetailSlice'
import commentsSlice, { comments } from './store/CommentsSlice'
import createPostSlice, { createPost } from './store/createPostSlice'
import RouteSlice, { routes } from './store/RouteListSlice'
import RouteListSlice from './store/RouteListSlice'

/* persist 선언 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

/* reducer 세팅 */
/* reducer가 추가되면, 추가해 주세요. */
const reducers = combineReducers({
  auth: authSlice,
  userInfo: userInfoSlice,
  modal: modalSlice,
  articles: articleSlice,
  follow: followSlice,
  locations: locationListSlice,
  articleDetails: articleDetailSlice,
  comments: commentsSlice,
  routes: RouteListSlice,
  createPost: createPostSlice
})

/* persist reducer 세팅 (persistConfig가 추가된 reducer) */
const persistedReducer = persistReducer(persistConfig, reducers)

/* store 세팅 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

/* RootState Type 세팅 */
export interface RootState {
  auth: auth
  userInfo: UserInfo
  modal: modals
  articles: articles
  follow: followInfo
  locations: locations
  articleDetails: articleDetails
  comments: comments
  createPost: createPost
  routes: routes
}

/* persist store 세팅 (새로고침, 종료해도 지속될 store) */
export const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
