import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import apiReducer from "./reducers/apiReducer";
import adminReducer from "./reducers/adminReducer";

const store = configureStore({
  reducer: {
    notificationContext: notificationReducer,
    apiContext: apiReducer,
    adminContext: adminReducer,
  },
});

export default store;
