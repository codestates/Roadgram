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
})

/* persist reducer 세팅 (persistConfig가 추가된 reducer) */
const persistedReducer = persistReducer(persistConfig, reducers)

/* store 세팅 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
})

/* RootState Type 세팅 */
export interface RootState {
  auth: auth
}

/* persist store 세팅 (새로고침, 종료해도 지속될 store) */
export const persistor = persistStore(store)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
