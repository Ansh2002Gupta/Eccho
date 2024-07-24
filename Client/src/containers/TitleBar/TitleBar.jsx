import React from "react";

import SearchIcon from "@mui/icons-material/Search";
import styles from "./TitleBar.module.scss";

const TitleBar = () => {
  return (
    <div className={`${styles.TitleBarContainer}`}>
      <div className={`${styles.searchBarContainer}`}>
        <div className={`${styles.adornmentImage}`}>
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search contacts, messages or options here"
          className={`${styles.inputArea}`}
        />
      </div>
      <div className={`${styles.userContainer}`}>
        <div className={`${styles.inColumn}`}>
          <h3 className={`${styles.userName}`}>John Mattews</h3>
          <div className={`${styles.inRow}`}>
            <div className={`${styles.dot}`}></div>
            <h5 className={`${styles.onlineStatus}`}>Online</h5>
          </div>
        </div>
        <img
          src="https://picsum.photos/id/102/1920/1080"
          alt="profile photo"
          className={`${styles.profilePhotoContainer}`}
        />
      </div>
    </div>
  );
};

export default TitleBar;
