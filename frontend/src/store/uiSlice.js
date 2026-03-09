import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,
    trailerModal: { open: false, videoKey: null, title: '' },
    darkMode: true
  },
  reducers: {
    showToast: (state, { payload }) => { state.toast = payload },
    hideToast: (state) => { state.toast = null },
    openTrailer: (state, { payload }) => { state.trailerModal = { open: true, ...payload } },
    closeTrailer: (state) => { state.trailerModal = { open: false, videoKey: null, title: '' } },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode }
  }
})

export const { showToast, hideToast, openTrailer, closeTrailer, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer
