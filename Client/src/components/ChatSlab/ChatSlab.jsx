import React from "react";

import styles from "./ChatSlab.module.scss";
import { formatMessageTime } from "../../utility/dateTimeService";

const ChatSlab = ({ contactPersonInfo, isActive, onClick }) => {
  const {
    _id: id,
    Name: name,
    ProfilePicture: image,
    UnreadMessageDetails,
  } = contactPersonInfo;
  const { Message: latestMessage, CreatedAt: latestMessageTime } =
    UnreadMessageDetails?.[(UnreadMessageDetails?.length || 1) - 1] ?? {
      Message: "",
      CreatedAt: "",
    };
  const unreadMessageCount = UnreadMessageDetails?.length || 0;

  return (
    <div
      className={`${styles.parentContainer} ${
        isActive ? styles.active : styles.inactive
      }`}
      onClick={() => onClick(contactPersonInfo)}
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
            {!latestMessageTime ? "" : formatMessageTime(latestMessageTime)}
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
            {latestMessage}
          </span>
          <span
            className={`${styles.count} ${
              isActive ? styles.count_active : styles.count_inactive
            }`}
          >
            {unreadMessageCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatSlab;
