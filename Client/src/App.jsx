import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Auth from "./screens/Auth/index";
import Main from "./screens/Main/Main";
import Custom from "./screens/Custom/Custom";
import { routes } from "./routes";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path={routes.HOME} element={<Auth />} />
          <Route path={routes.CHATS} element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
