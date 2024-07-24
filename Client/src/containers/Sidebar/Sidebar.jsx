import React from "react";

import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SegmentIcon from "@mui/icons-material/Segment";
import GridViewIcon from "@mui/icons-material/GridView";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <div className={`${styles.sidebarContainer}`}>
      <div className={`${styles.logoutContainer}`}>
        <div className={`${styles.navigationIcon}`}>
          <PowerSettingsNewIcon fontSize="large" />
        </div>
      </div>
      <div className={`${styles.primaryNavigationsContainer}`}>
        <div className={`${styles.navigationIcon}`}>
          <ChatIcon fontSize="large" />
        </div>
        <div className={`${styles.navigationIcon}`}>
          <PersonIcon fontSize="large" />
        </div>
        <div className={`${styles.navigationIcon}`}>
          <GridViewIcon fontSize="large" />
        </div>
      </div>
      <div className={`${styles.secondaryNavigationsContainer}`}>
        <div className={`${styles.navigationIcon}`}>
          <SettingsIcon fontSize="large" />
        </div>
        <div className={`${styles.navigationIcon}`}>
          <SegmentIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
