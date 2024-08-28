import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "./screens/Auth/index";
import Main from "./screens/Main/Main";
import Custom from "./screens/Custom/Custom";
import { routes } from "./routes";
import { Provider } from "react-redux";
import store from "./redux/store";
import Notification from "./components/Notification/Notification";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/eccho/app">
          <Routes>
            <Route path="/" element={<Navigate to="/sign-in" />} />
            <Route path={routes.SIGNIN} element={<Auth />} />
            <Route path={routes.SIGNUP} element={<Auth />} />
            <Route path={routes.CHATS} element={<Main />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
