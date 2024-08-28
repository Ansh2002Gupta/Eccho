import React, { useEffect, useState } from "react";
import Sidebar from "../../containers/Sidebar/Sidebar";
import TitleBar from "../../containers/TitleBar/TitleBar";
import styles from "./Main.module.scss";
import ChatMenu from "../../containers/ChatMenu/ChatMenu";
import ChatArea from "../../containers/ChatArea/ChatArea";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import PopUpWrapper from "../../hocs/PopUpWrapper/PopUpWrapper";

const Main = () => {
  const navigate = useNavigate();
  const [popUpElement, setPopUpElement] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authToken") === null) {
      navigate(routes.SIGNIN);
    }
  }, [localStorage.getItem("authToken")]);

  return (
    <div className={`${styles.mainPageContainer}`}>
      <PopUpWrapper {...{ popUpElement, setPopUpElement }} />
      <TitleBar />
      <Sidebar {...{ setPopUpElement }} />
      <div className={`${styles.messagingArena}`}>
        <ChatMenu />
        <ChatArea />
      </div>
    </div>
  );
};

export default Main;
