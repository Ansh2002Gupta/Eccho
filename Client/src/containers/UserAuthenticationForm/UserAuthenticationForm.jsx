import React, { useState } from "react";

import styles from "./UserAuthenticationForm.module.scss";
import EcchoTextField from "../../components/EcchoTextField/EcchoTextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { IconButton } from "@mui/material";

const UserAuthenticationForm = () => {
  return (
    <>
      <div className={`${styles.formContainer}`}>
        <h1 className={`${styles.heading}`}>Create your account</h1>
        <h3 className={`${styles.subHeading}`}>Made for Bharat, by Bharat</h3>
        <div className={`${styles.formWrapper}`}>
          <LoginComponent />
        </div>
        <div className={`${styles.termsConditionsWrapper}`}>
          <input
            className={`${styles.checkbox}`}
            type="checkbox"
            name="termsConditions"
          />
          <h3 className={`${styles.termsConditionSentence}`}>
            I agree to the{" "}
            <a className={`${styles.termsConditionAnchor}`} href="/">
              terms and conditions
            </a>
          </h3>
        </div>
        <button title="Submit" className={`${styles.submitButton}`}>
          Submit
        </button>
        <div className={`${styles.footerSentence}`}>
          <h3 className={`${styles.doNotHaveAccount}`}>
            Don't have an account ?{" "}
            <a className={`${styles.signUpAnchor}`} href="/">
              SignUp
            </a>
          </h3>
        </div>
      </div>
    </>
  );
};

const SignupComponent = () => {
  return (
    <>
      <div>signup compnent</div>
    </>
  );
};

const LoginComponent = () => {
  const [isShowPassword, setShowPassword] = useState(false);
  return (
    <>
      <EcchoTextField
        label="Username"
        customStyles={{ m: 1, width: "100%" }}
        isStartAdornment
        adornmentElement={[<AccountCircle />]}
        isRequired
        helperText="Invalid"
      />
      <EcchoTextField
        type="email"
        label="Email"
        customStyles={{ m: 1, width: "100%" }}
        isStartAdornment
        adornmentElement={[<EmailIcon />]}
        isRequired
        helperText="Invalid"
      />
      <EcchoTextField
        type={isShowPassword ? "text" : "password"}
        label="Passcode"
        customStyles={{ m: 1, width: "100%" }}
        isStartAdornment
        isEndAdornment
        adornmentElement={[
          <KeyIcon />,
          <CheckPasswordIcon {...{ isShowPassword, setShowPassword }} />,
        ]}
        isRequired
        helperText="Invalid"
      />
    </>
  );
};

const CheckPasswordIcon = ({ isShowPassword, setShowPassword }) => {
  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={() => setShowPassword((prev) => !prev)}
      edge="end"
    >
      {isShowPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </IconButton>
  );
};

export default UserAuthenticationForm;
