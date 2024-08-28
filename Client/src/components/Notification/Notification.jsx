import react, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import Loader from "../../../public/images/Loader.svg";
import styles from "./Notification.module.scss";
import { hideNotification } from "../../redux/reducers/notificationReducer";
import { notificationTypes } from "../../config/app_constants";

const Notification = () => {
  const isVisible = useSelector((state) => state.notificationContext.isVisible);
  const type = useSelector((state) => state.notificationContext.type);
  const message = useSelector((state) => state.notificationContext.message);
  const adornmentImage = useSelector(
    (state) => state.notificationContext.adornmentImage
  );
  const dismissOut = useSelector(
    (state) => state.notificationContext.dismissOut
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideNotification({ isVisible: false }));
    }, dismissOut);
    return () => clearTimeout(timer);
  }, [isVisible, dispatch, dismissOut]);

  const conditionalNotificationStylings = () => {
    switch (type.trim().toLowerCase()) {
      case notificationTypes.ERROR.trim().toLowerCase():
        return styles.errorNotificationStyling;
      case notificationTypes.SUCCESS.trim().toLowerCase():
        return styles.successNotificationStyling;
      case notificationTypes.WARNING.trim().toLowerCase():
        return styles.warningNotificationStyling;
      case notificationTypes.INFO.trim().toLowerCase():
        return styles.infoNotificationStyling;
      default:
        return styles.infoNotificationStyling;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            type: "spring",
            bounce: 0.5,
          }}
          className={`${styles.parentContainer}`}
        >
          <div
            className={`${
              styles.notificationContainer
            } ${conditionalNotificationStylings()}`}
          >
            <img
              src={adornmentImage}
              alt="notification-image"
              className={`${styles.notificationImage}`}
            />
            <div className={`${styles.notificationMessage}`}>{message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
