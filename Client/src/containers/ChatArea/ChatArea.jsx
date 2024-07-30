import React, { useState } from "react";
import { motion } from "framer-motion";

import EcchoToolTip from "../../hocs/EcchoToolTip/index";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import FolderIcon from "@mui/icons-material/Folder";
import UtilityWrapper from "../../components/UtilityWrapper/UtilityWrapper";
import loader from "../../../public/images/Loader.svg";
import SendIcon from "@mui/icons-material/Send";
import { listOfMessages } from "./data";
import { MESSAGE_TYPE } from "../../core/AppConstants";
import styles from "./ChatArea.module.scss";

const ChatArea = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(undefined);
  return (
    <div className={`${styles.parentContainer}`}>
      <div className={`${styles.userContainerWrapper}`}>
        <div className={`${styles.userContainer}`}>
          <img
            src="https://picsum.photos/id/101/1920/1080"
            alt="profile photo"
            className={`${styles.profilePhotoContainer}`}
          />
          <div className={`${styles.inColumn}`}>
            <h4 className={`${styles.userName}`}>Elon Musk</h4>
            <div className={`${styles.inRow}`}>
              <div className={`${styles.dot}`}></div>
              <h6 className={`${styles.onlineStatus}`}>Online</h6>
            </div>
          </div>
        </div>
        <div className={`${styles.inRow}`}>
          <EcchoToolTip title="Video Call" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <VideoCameraFrontIcon
                fontSize="medium"
                htmlColor="var(--primary)"
              />
            </div>
          </EcchoToolTip>
          <EcchoToolTip title="Phone Call" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <CallIcon fontSize="medium" htmlColor="var(--primary)" />
            </div>
          </EcchoToolTip>
          <EcchoToolTip title="Files" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <FolderIcon fontSize="medium" htmlColor="var(--primary)" />
            </div>
          </EcchoToolTip>
        </div>
      </div>
      <div className={`${styles.messagingArea}`}>
        {isLoading && (
          <>
            <div className={`${styles.overlay}`}></div>
            <img
              src={loader}
              alt="Loading..."
              className={`${styles.loaderImage}`}
            />
          </>
        )}
        {!isLoading && (
          <>
            <div className={`${styles.dateIdentifier}`}>
              <div className={`${styles.dateWrapper}`}></div>
              <span className={`${styles.dateStyling}`}>23rd July 2024</span>
            </div>
            {listOfMessages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg?.type === MESSAGE_TYPE?.OUTGOING
                    ? styles.inRow_messages_outgoing
                    : styles.inRow_messages_incoming
                }`}
              >
                <img
                  src={msg?.profileImage}
                  alt="profile photo"
                  className={`${styles.profilePhotoContainer_messaging_area}`}
                />
                <div
                  className={`${styles.messageContainer} ${
                    msg.type === MESSAGE_TYPE?.INCOMING
                      ? styles.extraStyling_messageContainer_incoming
                      : null
                  }`}
                >
                  <p className={`${styles.message}`}>{msg?.message}</p>
                </div>
                <div className={`${styles.time}`}>{msg?.time}</div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={`${styles.inputArea}`}>
        <div className={`${styles.inRow}`}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here...."
            className={`${styles.messageBox}`}
          />
          <UtilityWrapper />
          <EcchoToolTip title="Send Message" position="top">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`${styles.sendButton}`}
            >
              <SendIcon fontSize="medium" htmlColor="var(--primary)" />
            </motion.div>
          </EcchoToolTip>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
