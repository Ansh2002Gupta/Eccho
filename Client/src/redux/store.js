import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import apiReducer from "./reducers/apiReducer";
import adminReducer from "./reducers/adminReducer";
import ChatListReducer from "./reducers/ChatListReducer";

const store = configureStore({
  reducer: {
    notificationContext: notificationReducer,
    apiContext: apiReducer,
    adminContext: adminReducer,
    chatListContext: ChatListReducer,
  },
});

export default store;
