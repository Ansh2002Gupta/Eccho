import React, { useState } from "react";

import UserAuthenticationForm from "../../containers/UserAuthenticationForm/UserAuthenticationForm";
import styles from "./Auth.module.scss";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(false);

  return isSignIn ? (
    <SignIn {...{ setIsSignIn }} />
  ) : (
    <SignUp {...{ setIsSignIn }} />
  );
};

const SignIn = ({ setIsSignIn }) => {
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
            <UserAuthenticationForm isSignIn={true} {...{ setIsSignIn }} />
          </div>
        </div>
      </div>
    </>
  );
};

const SignUp = ({ setIsSignIn }) => {
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
            <UserAuthenticationForm isSignIn={false} {...{ setIsSignIn }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
