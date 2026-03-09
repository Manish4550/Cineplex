import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

const token = localStorage.getItem('cineplex_token')

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('cineplex_token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('cineplex_token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Auth failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: token || null,
    loading: false,
    error: null,
    initialized: false
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('cineplex_token')
    },
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }
    const fulfilled = (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token || state.token
    }

    builder
      .addCase(loginUser.pending, pending).addCase(loginUser.fulfilled, fulfilled).addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending).addCase(registerUser.fulfilled, fulfilled).addCase(registerUser.rejected, rejected)
      .addCase(fetchMe.pending, (state) => { state.loading = true })
      .addCase(fetchMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.initialized = true })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; state.initialized = true; state.token = null; localStorage.removeItem('cineplex_token') })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
