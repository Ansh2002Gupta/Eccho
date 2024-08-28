import { createSlice } from "@reduxjs/toolkit";
import { ACTIVITY_STATUS } from "../../config/app_constants";

const adminSlice = createSlice({
  name: "adminContext",
  initialState: {
    name: undefined,
    email: undefined,
    phoneNumber: undefined,
    profilePicture: undefined,
    about: undefined,
    status: undefined,
    accessToken: undefined,
  },
  reducers: {
    setAdminData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.accessToken = action.payload.accessToken;
    },
    setOtherDetails: (state, action) => {
      state.profilePicture = action.payload?.profilePicture;
      state.about = action.payload?.about;
      state.status = action.payload?.status || ACTIVITY_STATUS.OFFLINE;
    },
  },
});

export const { setAdminData, setOtherDetails } = adminSlice.actions;

export default adminSlice.reducer;
