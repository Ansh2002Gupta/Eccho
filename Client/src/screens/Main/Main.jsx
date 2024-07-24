import React from "react";
import Sidebar from "../../containers/Sidebar/Sidebar";
import TitleBar from "../../containers/TitleBar/TitleBar";
import styles from "./Main.module.scss";
import ChatMenu from "../../containers/ChatMenu/ChatMenu";
import ChatArea from "../../containers/ChatArea/ChatArea";

const Main = () => {
  return (
    <div className={`${styles.mainPageContainer}`}>
      <TitleBar />
      <Sidebar />
      <div className={`${styles.messagingArena}`}>
        <ChatMenu />
        <ChatArea />
      </div>
    </div>
  );
};

export default Main;
