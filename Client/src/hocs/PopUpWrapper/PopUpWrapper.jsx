import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./PopUpWrapper.module.scss";
import useOutsideClick from "../../hooks/useOutsideClick";

const PopUpWrapper = ({ popUpElement, setPopUpElement }) => {
  const { targetElement } = useOutsideClick({
    onOutsideClick: () => setPopUpElement(null),
  });

  return (
    <AnimatePresence>
      {!!popUpElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "linear", duration: 0.5 }}
          className={`${styles.absoluteContainer}`}
        >
          <div className={`${styles.glass}`}></div>
          <AnimatePresence>
            {!!popUpElement && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                  scale: {
                    type: "spring",
                    damping: 18,
                    stiffness: 350,
                    restDelta: 0.001,
                  },
                }}
                className={`${styles.popUpContainer}`}
                ref={targetElement}
              >
                {popUpElement}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopUpWrapper;
