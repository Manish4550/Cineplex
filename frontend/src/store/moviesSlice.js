import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tmdb from '../utils/tmdb'

export const fetchTrending = createAsyncThunk('movies/trending', async (mediaType = 'all') => {
  const { data } = await tmdb.get(`/trending/${mediaType}/week`)
  return data.results
})

export const fetchPopularMovies = createAsyncThunk('movies/popularMovies', async (page = 1) => {
  const { data } = await tmdb.get('/movie/popular', { params: { page } })
  return { results: data.results, page, totalPages: data.total_pages }
})

export const fetchPopularTV = createAsyncThunk('movies/popularTV', async (page = 1) => {
  const { data } = await tmdb.get('/tv/popular', { params: { page } })
  return { results: data.results, page, totalPages: data.total_pages }
})

export const fetchMovieDetails = createAsyncThunk('movies/details', async ({ id, type }) => {
  const [details, videos, credits, similar] = await Promise.all([
    tmdb.get(`/${type}/${id}`),
    tmdb.get(`/${type}/${id}/videos`),
    tmdb.get(`/${type}/${id}/credits`),
    tmdb.get(`/${type}/${id}/similar`)
  ])
  return {
    ...details.data,
    videos: videos.data.results,
    credits: credits.data,
    similar: similar.data.results,
    mediaType: type
  }
})

export const searchContent = createAsyncThunk('movies/search', async ({ query, page = 1 }) => {
  const { data } = await tmdb.get('/search/multi', { params: { query, page } })
  return { results: data.results, page, totalPages: data.total_pages, query }
})

export const fetchPersonDetails = createAsyncThunk('movies/person', async (id) => {
  const [person, credits] = await Promise.all([
    tmdb.get(`/person/${id}`),
    tmdb.get(`/person/${id}/combined_credits`)
  ])
  return { ...person.data, credits: credits.data }
})

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    popularMovies: { results: [], page: 1, totalPages: 1 },
    popularTV: { results: [], page: 1, totalPages: 1 },
    currentItem: null,
    currentPerson: null,
    search: { results: [], page: 1, totalPages: 1, query: '' },
    loading: {},
    error: null
  },
  reducers: {
    clearCurrentItem: (state) => { state.currentItem = null },
    clearSearch: (state) => { state.search = { results: [], page: 1, totalPages: 1, query: '' } }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.fulfilled, (state, { payload }) => { state.trending = payload })
      .addCase(fetchPopularMovies.fulfilled, (state, { payload }) => {
        if (payload.page === 1) state.popularMovies.results = payload.results
        else state.popularMovies.results = [...state.popularMovies.results, ...payload.results]
        state.popularMovies.page = payload.page
        state.popularMovies.totalPages = payload.totalPages
      })
      .addCase(fetchPopularTV.fulfilled, (state, { payload }) => {
        if (payload.page === 1) state.popularTV.results = payload.results
        else state.popularTV.results = [...state.popularTV.results, ...payload.results]
        state.popularTV.page = payload.page
        state.popularTV.totalPages = payload.totalPages
      })
      .addCase(fetchMovieDetails.pending, (state) => { state.loading.details = true; state.currentItem = null })
      .addCase(fetchMovieDetails.fulfilled, (state, { payload }) => { state.loading.details = false; state.currentItem = payload })
      .addCase(fetchMovieDetails.rejected, (state) => { state.loading.details = false })
      .addCase(searchContent.pending, (state) => { state.loading.search = true })
      .addCase(searchContent.fulfilled, (state, { payload }) => {
        state.loading.search = false
        state.search.query = payload.query
        if (payload.page === 1) state.search.results = payload.results
        else state.search.results = [...state.search.results, ...payload.results]
        state.search.page = payload.page
        state.search.totalPages = payload.totalPages
      })
      .addCase(searchContent.rejected, (state) => { state.loading.search = false })
      .addCase(fetchPersonDetails.fulfilled, (state, { payload }) => { state.currentPerson = payload })
  }
})

export const { clearCurrentItem, clearSearch } = moviesSlice.actions
export default moviesSlice.reducer
