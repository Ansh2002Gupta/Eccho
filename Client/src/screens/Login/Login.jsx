import React from "react";

import UserAuthenticationForm from "../../containers/UserAuthenticationForm/UserAuthenticationForm";
import styles from "./Login.module.scss";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

const Login = () => {
  return (
    <>
      <div className={`${styles.fullScreen} ${styles.positionRelative}`}>
        <div className={`${styles.circle1}`} />
        <div className={`${styles.circle2}`} />
        <div className={`${styles.positionAbsolute} ${styles.titleContainer}`}>
          <h1 className={`${styles.title}`}>Eccho</h1>
        </div>
        <div
          className={`${styles.fullScreen} ${styles.noHorizontalScroll} ${styles.noVerticalScroll} ${styles.test}`}
        />
        <div
          className={`${styles.positionAbsolute} ${styles.glass} ${styles.overlay}`}
        >
          <div className={`${styles.secondaryWrapper}`}>
            <ImageSlider />
            <UserAuthenticationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
