import React, { useState } from "react";

import { motion } from "framer-motion";

import EcchoToolTip from "../../hocs/EcchoToolTip/index";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import FolderIcon from "@mui/icons-material/Folder";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import styles from "./UtilityWrapper.module.scss";

const UtilityWrapper = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className={`${styles.utilityWrapper}`}>
      <EcchoToolTip title="Emoji" position="right">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          animate={isClicked ? { y: -190, opacity: 1 } : { y: 0, opacity: 0 }}
          className={`${styles.childUtilityButton} ${styles.child1_position}`}
        >
          <EmojiEmotionsIcon fontSize="small" />
        </motion.div>
      </EcchoToolTip>
      <EcchoToolTip title="Phone Call" position="right">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          animate={isClicked ? { y: -155, opacity: 1 } : { y: 0, opacity: 0 }}
          className={`${styles.childUtilityButton} ${styles.child2_position}`}
        >
          <CallIcon fontSize="small" />
        </motion.div>
      </EcchoToolTip>
      <EcchoToolTip title="Video Call" position="right">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          animate={isClicked ? { y: -120, opacity: 1 } : { y: 0, opacity: 0 }}
          className={`${styles.childUtilityButton} ${styles.child3_position}`}
        >
          <VideoCameraFrontIcon fontSize="small" />
        </motion.div>
      </EcchoToolTip>
      <EcchoToolTip title="Files" position="right">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          animate={isClicked ? { y: -85, opacity: 1 } : { y: 0, opacity: 0 }}
          className={`${styles.childUtilityButton} ${styles.child4_position}`}
        >
          <FolderIcon fontSize="small" />
        </motion.div>
      </EcchoToolTip>
      <EcchoToolTip title="Send" position="right">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}
          animate={isClicked ? { y: -50, opacity: 1 } : { y: 0, opacity: 0 }}
          // transition={{ type: "spring", stiffness: 100 }}
          className={`${styles.childUtilityButton} ${styles.child5_position}`}
        >
          <SendIcon fontSize="small" />
        </motion.div>
      </EcchoToolTip>
      <EcchoToolTip title="Extras" position="top">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`${styles.rootUtilityButton}`}
          onClick={handleClick}
        >
          <AddIcon fontSize="medium" />
        </motion.div>
      </EcchoToolTip>
    </div>
  );
};

export default UtilityWrapper;
