import React, { useState } from "react";

import styles from "./Custom.module.scss";
import UtilityWrapper from "../../components/UtilityWrapper/UtilityWrapper";

const Custom = () => {
  return (
    <>
      <div className={`${styles.parentContainer}`}>
        <UtilityWrapper />
      </div>
    </>
  );
};

export default Custom;
