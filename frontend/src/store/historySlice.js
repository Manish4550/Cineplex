import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchHistory = createAsyncThunk('history/fetch', async () => {
  const { data } = await api.get('/history')
  return data.history
})

export const addToHistory = createAsyncThunk('history/add', async (item) => {
  const { data } = await api.post('/history', item)
  return data.entry
})

export const clearHistory = createAsyncThunk('history/clear', async () => {
  await api.delete('/history')
})

const historySlice = createSlice({
  name: 'history',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, { payload }) => { state.items = payload })
      .addCase(addToHistory.fulfilled, (state, { payload }) => {
        state.items = [payload, ...state.items.filter(h => h.tmdbId !== payload.tmdbId)].slice(0, 50)
      })
      .addCase(clearHistory.fulfilled, (state) => { state.items = [] })
  }
})

export default historySlice.reducer
