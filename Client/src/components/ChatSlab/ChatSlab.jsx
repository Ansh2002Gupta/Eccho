import React, { useState } from "react";

import styles from "./ChatSlab.module.scss";

const ChatSlab = ({ contactPersonInfo, isActive, onClick }) => {
  const { id, name, image, latestMessages } = contactPersonInfo;

  return (
    <div
      className={`${styles.parentContainer} ${
        isActive ? styles.active : styles.inactive
      }`}
      onClick={() => onClick(id)}
    >
      <img
        className={`${styles.contactPersonImage}`}
        src={image}
        alt="Contact Person Image"
      />
      <div className={`${styles.secondaryContainer}`}>
        <div className={`${styles.userNameAndDateContainer}`}>
          <span
            className={`${styles.userName} ${
              isActive ? styles.userName_active : styles.userName_inactive
            }`}
          >
            {name}
          </span>
          <span
            className={`${styles.lastMessageTime} ${
              isActive
                ? styles.lastMessageTime_active
                : styles.lastMessageTime_inactive
            }`}
          >
            {latestMessages[latestMessages.length - 1]?.time}
          </span>
        </div>
        <div className={`${styles.lastestMessageAndUnReadMsgCountContainer}`}>
          <span
            className={`${styles.latestMessage} ${
              isActive
                ? styles.lastestMessage_active
                : styles.lastestMessage_inactive
            }`}
          >
            {latestMessages[latestMessages.length - 1]?.statement}
          </span>
          <span
            className={`${styles.count} ${
              isActive ? styles.count_active : styles.count_inactive
            }`}
          >
            {latestMessages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatSlab;
