import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  const { data } = await api.get('/favorites')
  return data.favorites
})

export const addFavorite = createAsyncThunk('favorites/add', async (item, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/favorites', item)
    return data.favorite
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const removeFavorite = createAsyncThunk('favorites/remove', async (tmdbId) => {
  await api.delete(`/favorites/${tmdbId}`)
  return tmdbId
})

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true })
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload })
      .addCase(fetchFavorites.rejected, (state) => { state.loading = false })
      .addCase(addFavorite.fulfilled, (state, { payload }) => { state.items.unshift(payload) })
      .addCase(removeFavorite.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(f => f.tmdbId !== String(payload))
      })
  }
})

export default favoritesSlice.reducer
