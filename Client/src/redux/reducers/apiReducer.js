import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  name: "apiContext",
  initialState: {
    isIdeal: true,
    isPending: false,
    isLoading: false,
  },
  reducers: {
    setIdeal: (state, action) => {
      state.isIdeal = action.payload.isIdeal;
      state.isLoading = !state.isIdeal;
      state.isPending = false;
    },
    setPending: (state, action) => {
      state.isIdeal = false;
      state.isPending = action.payload.isPending;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.isIdeal = !state.isLoading;
      state.isPending = false;
    },
  },
});

export const { setIdeal, setPending, setLoading } = apiSlice.actions;

export default apiSlice.reducer;
