import React, { useEffect, useState } from "react";
import Sidebar from "../../containers/Sidebar/Sidebar";
import TitleBar from "../../containers/TitleBar/TitleBar";
import styles from "./Main.module.scss";
import ChatMenu from "../../containers/ChatMenu/ChatMenu";
import ChatArea from "../../containers/ChatArea/ChatArea";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import PopUpWrapper from "../../hocs/PopUpWrapper/PopUpWrapper";
import Notification from "../../components/Notification/Notification";

const Main = () => {
  const navigate = useNavigate();
  const [activeChatPartnerInfo, setActiveChatPartnerInfo] = useState(null);
  const [popUpElement, setPopUpElement] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authToken") === null) {
      navigate(routes.SIGNIN);
    }
  }, [localStorage.getItem("authToken")]);

  const handleActiveChatPartner = (partnerInfo) => {
    setActiveChatPartnerInfo(partnerInfo);
  }

  return (
    <div className={`${styles.mainPageContainer}`}>
      <Notification />
      <PopUpWrapper {...{ popUpElement, setPopUpElement }} />
      <TitleBar />
      <Sidebar {...{ setPopUpElement }} />
      <div className={`${styles.messagingArena}`}>
        <ChatMenu setPartnerInfo={handleActiveChatPartner} />
        <ChatArea partnerInfo={activeChatPartnerInfo} />
      </div>
    </div>
  );
};

export default Main;
