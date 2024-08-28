import { createSlice } from "@reduxjs/toolkit";
import { notificationTypes } from "../../config/app_constants";

import Loader from "../../../public/images/Loader.svg";

const notificationSlice = createSlice({
  name: "notificationContext",
  initialState: {
    type: notificationTypes.SUCCESS,
    message: "Everything normal!",
    dismissOut: 5000,
    adornmentImage: Loader,
    isVisible: false,
  },
  reducers: {
    showNotification: (state, action) => {
      state.isVisible = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.adornmentImage = action.payload.adornmentImage;
    },
    hideNotification: (state, action) => {
      state.isVisible = action.payload.isVisible;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
