import React, { useState } from "react";

import SmsIcon from "@mui/icons-material/Sms";
import { chatMenuItems } from "../ChatMenu/data";
import styles from "./ContactPopUp.module.scss";
import EcchoToolTip from "../../hocs/EcchoToolTip/EcchoToolTip";
import { motion } from "framer-motion";

const ContactPopUp = ({ targetElement }) => {
  return (
    <div ref={targetElement} className={`${styles.glassContainer}`}>
      <h1 className={`${styles.contactHeading}`}>Your Contacts</h1>
      <div className={`${styles.listContainer}`}>
        {chatMenuItems.map((obj, index) => (
          <div key={index} className={`${styles.contactSlab}`}>
            <div className={`${styles.contactPersonDetails}`}>
              <EcchoToolTip title="Online" position="bottom">
                <div className={`${styles.availabilityIndicator}`}></div>
              </EcchoToolTip>
              <img
                src={obj?.image}
                alt="Contact Person Image"
                className={`${styles.contactPersonImage}`}
              />
              <div className={`${styles.inCol}`}>
                <h3 className={`${styles.contactPersonName}`}>{obj?.name}</h3>
                <h5 className={`${styles.contactPersonAbout}`}>{obj?.about}</h5>
              </div>
            </div>
            <motion.button
              className={`${styles.actionButton}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
            >
              <SmsIcon />
              <span>Chat</span>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPopUp;
