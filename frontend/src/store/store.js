import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import moviesReducer from './moviesSlice'
import favoritesReducer from './favoritesSlice'
import historyReducer from './historySlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    history: historyReducer,
    ui: uiReducer,
  }
})
