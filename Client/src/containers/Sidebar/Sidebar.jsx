import React from "react";
import { motion } from "framer-motion";

import EcchoToolTip from "../../hocs/EcchoToolTip/EcchoToolTip";
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
        <EcchoToolTip title="Logout" position="right">
          <div className={`${styles.navigationIcon}`}>
            <PowerSettingsNewIcon fontSize="large" />
          </div>
        </EcchoToolTip>
      </div>
      <div className={`${styles.primaryNavigationsContainer}`}>
        <EcchoToolTip title="Chats" position="right">
          <div className={`${styles.navigationIcon}`}>
            <ChatIcon fontSize="large" />
          </div>
        </EcchoToolTip>
        <EcchoToolTip title="Contacts" position="right">
          <div className={`${styles.navigationIcon}`}>
            <PersonIcon fontSize="large" />
          </div>
        </EcchoToolTip>
        <EcchoToolTip title="Groups" position="right">
          <div className={`${styles.navigationIcon}`}>
            <GridViewIcon fontSize="large" />
          </div>
        </EcchoToolTip>
      </div>
      <div className={`${styles.secondaryNavigationsContainer}`}>
        <EcchoToolTip title="Settings" position="right">
          <div className={`${styles.navigationIcon}`}>
            <SettingsIcon fontSize="large" />
          </div>
        </EcchoToolTip>
        <EcchoToolTip title="Future" position="right">
          <div className={`${styles.navigationIcon}`}>
            <SegmentIcon fontSize="large" />
          </div>
        </EcchoToolTip>
      </div>
    </div>
  );
};

export default Sidebar;
