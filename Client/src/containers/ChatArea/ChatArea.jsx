import React, { useState } from "react";

import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import FolderIcon from "@mui/icons-material/Folder";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import styles from "./ChatArea.module.scss";
import { MESSAGE_TYPE } from "../../core/AppConstants";
import { listOfMessages } from "./data";

const ChatArea = () => {
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
          <div className={`${styles.extraServicesIcon}`}>
            <VideoCameraFrontIcon
              fontSize="medium"
              htmlColor="var(--primary)"
            />
          </div>
          <div className={`${styles.extraServicesIcon}`}>
            <CallIcon fontSize="medium" htmlColor="var(--primary)" />
          </div>
          <div className={`${styles.extraServicesIcon}`}>
            <FolderIcon fontSize="medium" htmlColor="var(--primary)" />
          </div>
        </div>
      </div>
      <div className={`${styles.messagingArea}`}>
        <div className={`${styles.dateIdentifier}`}>
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
          <div className={`${styles.extraServicesIcon}`}>
            <EmojiEmotionsIcon fontSize="medium" htmlColor="var(--primary)" />
          </div>
          <div className={`${styles.extraServicesIcon}`}>
            <AddIcon fontSize="medium" htmlColor="var(--primary)" />
          </div>
          <div className={`${styles.extraServicesIcon} ${styles.sendButton}`}>
            <SendIcon fontSize="medium" htmlColor="var(--primary)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
