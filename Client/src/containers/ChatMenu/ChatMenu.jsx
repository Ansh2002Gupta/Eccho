import React, { useState } from "react";

import ChatSlab from "../../components/ChatSlab/index";
import styles from "./ChatMenu.module.scss";
import { chatMenuItems } from "./data";

const ChatMenu = () => {
  const [activeId, setActiveId] = useState(undefined);
  const handleClick = (id) => {
    setActiveId(id);
  };
  return (
    <div className={`${styles.parentContainer}`}>
      {chatMenuItems.map((item, idx) => (
        <ChatSlab
          key={idx}
          contactPersonInfo={item}
          isActive={activeId === idx}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default ChatMenu;
