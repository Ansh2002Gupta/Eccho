import React from "react";

import styles from "./BackDropScreen.module.scss";

const BackDropScreen = () => {
  return (
    <>
      <div className={`${styles.fullScreen} ${styles.positionRelative}`}>
        <div className={`${styles.positionAbsolute} ${styles.titleContainer}`}>
          <h1 className={`styles.title`}>Eccho</h1>
        </div>
        <div
          className={`${styles.fullScreen} ${styles.noHorizontalScroll} ${styles.noVerticalScroll} ${styles.test}`}
        />
        <div
          className={`${styles.positionAbsolute} ${styles.glass} ${styles.overlay}`}
        ></div>
      </div>
    </>
  );
};

export default BackDropScreen;
