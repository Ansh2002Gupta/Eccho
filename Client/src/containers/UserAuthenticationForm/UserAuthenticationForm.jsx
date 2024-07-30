import React, { useEffect, useState } from "react";
import { Field, Form, Formik, useFormikContext } from "formik";

import styles from "./UserAuthenticationForm.module.scss";
import EcchoTextField from "../../components/EcchoTextField/EcchoTextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { IconButton } from "@mui/material";
import Call from "@mui/icons-material/Call";
import { SignInSchema } from "../../schemas/Schema-signIn";
import { SignUpSchema } from "../../schemas/Schema-signUp";

const UserAuthenticationForm = ({ isSignIn, setIsSignIn }) => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [hasAcceptedTermsConditions, setHasAcceptedTermsConditions] =
    useState(false);
  return (
    <>
      <div className={`${styles.formContainer}`}>
        <h1 className={`${styles.heading}`}>
          {isSignIn ? "Welcome back!" : "Create Your Account"}
        </h1>
        <h3 className={`${styles.subHeading}`}>Made for Bharat, by Bharat</h3>
        <div className={`${styles.formWrapper}`}>
          {isSignIn ? (
            <SignInForm {...{ setIsFormDirty }} />
          ) : (
            <SignUpForm {...{ setIsFormDirty }} />
          )}
        </div>
        {!isSignIn && (
          <div className={`${styles.termsConditionsWrapper}`}>
            <input
              className={`${styles.checkbox}`}
              type="checkbox"
              name="termsConditions"
              onChange={() => setHasAcceptedTermsConditions((prev) => !prev)}
            />
            <h3 className={`${styles.termsConditionSentence}`}>
              I agree to the{" "}
              <a className={`${styles.termsConditionAnchor}`} href="/">
                terms and conditions
              </a>
            </h3>
          </div>
        )}
        <button
          className={`${styles.submitButton}`}
          disabled={isFormDirty || (!isSignIn && !hasAcceptedTermsConditions)}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
        <div className={`${styles.footerSentence}`}>
          <h3 className={`${styles.doNotHaveAccount}`}>
            {isSignIn ? "Don't have an account ?" : "Already have an account ?"}
            <button
              className={`${styles.footerSentenceButton}`}
              onClick={() => setIsSignIn((prev) => !prev)}
            >
              {isSignIn ? "SignUp" : "SignIn"}
            </button>
          </h3>
        </div>
      </div>
    </>
  );
};

const FormObserver = ({ setIsFormDirty, totalFieldsOfForm }) => {
  const { errors, touched } = useFormikContext();
  useEffect(() => {
    if (
      Object.keys(errors).length === 0 &&
      Object.keys(touched).length === totalFieldsOfForm
    ) {
      setIsFormDirty(false);
    } else setIsFormDirty(true);
  }, [errors, touched]);
  return null;
};

const SignUpForm = ({ setIsFormDirty }) => {
  const initialFormValues = {
    userName: "",
    email: "",
    phoneNumber: "",
    passCode: "",
  };
  const [isShowPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={SignUpSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleBlur, handleChange }) => {
        return (
          <Form>
            <FormObserver
              setIsFormDirty={setIsFormDirty}
              totalFieldsOfForm={4}
            />
            <Field name="userName">
              {({ field, meta }) => {
                return (
                  <EcchoTextField
                    id="outlined-error-helper-text"
                    label="Username"
                    value={field.value}
                    onChange={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    customStyles={{ m: 1, width: "100%" }}
                    isStartAdornment
                    adornmentElement={[<AccountCircle />]}
                    isRequired
                    isError={meta.touched && meta.error}
                    helperText={meta.touched && meta.error ? meta.error : ""}
                  />
                );
              }}
            </Field>
            <Field name="email">
              {({ field, meta }) => {
                return (
                  <EcchoTextField
                    type="email"
                    label="Email"
                    value={field.value}
                    onChange={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    customStyles={{ m: 1, width: "100%" }}
                    isStartAdornment
                    adornmentElement={[<EmailIcon />]}
                    isRequired
                    isError={meta.touched && meta.error}
                    helperText={meta.touched && meta.error ? meta.error : ""}
                  />
                );
              }}
            </Field>
            <Field name="phoneNumber">
              {({ field, meta }) => {
                return (
                  <EcchoTextField
                    label="Phone Number"
                    value={field.value}
                    onChange={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    customStyles={{ m: 1, width: "100%" }}
                    isStartAdornment
                    adornmentElement={[<Call />]}
                    isRequired
                    isError={meta.touched && meta.error}
                    helperText={meta.touched && meta.error ? meta.error : ""}
                  />
                );
              }}
            </Field>
            <Field name="passCode">
              {({ field, meta }) => {
                return (
                  <EcchoTextField
                    type={isShowPassword ? "text" : "password"}
                    label="Passcode"
                    value={field.value}
                    onChange={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    customStyles={{ m: 1, width: "100%" }}
                    isStartAdornment
                    isEndAdornment
                    adornmentElement={[
                      <KeyIcon />,
                      <CheckPasswordIcon
                        {...{ isShowPassword, setShowPassword }}
                      />,
                    ]}
                    isRequired
                    isError={meta.touched && meta.error}
                    helperText={meta.touched && meta.error ? meta.error : ""}
                  />
                );
              }}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
};

const SignInForm = ({ setIsFormDirty }) => {
  const initialFormValues = {
    userName: "",
    email: "",
    passCode: "",
  };
  const [isShowPassword, setShowPassword] = useState(false);
  return (
    <Formik initialValues={initialFormValues} validationSchema={SignInSchema}>
      {({ handleChange, handleBlur }) => {
        return (
          <Form>
            <FormObserver
              setIsFormDirty={setIsFormDirty}
              totalFieldsOfForm={3}
            />
            <Field name="userName">
              {({ field, meta }) => (
                <EcchoTextField
                  label="Username"
                  value={field.value}
                  onChange={handleChange(field.name)}
                  onBlur={handleBlur(field.name)}
                  customStyles={{ m: 1, width: "100%" }}
                  isStartAdornment
                  adornmentElement={[<AccountCircle />]}
                  isRequired
                  isError={meta.touched && meta.error}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                />
              )}
            </Field>
            <Field name="email">
              {({ field, meta }) => (
                <EcchoTextField
                  type="email"
                  label="Email"
                  value={field.value}
                  onChange={handleChange(field.name)}
                  onBlur={handleBlur(field.name)}
                  customStyles={{ m: 1, width: "100%" }}
                  isStartAdornment
                  adornmentElement={[<EmailIcon />]}
                  isRequired
                  isError={meta.touched && meta.error}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                />
              )}
            </Field>
            <Field name="passCode">
              {({ field, meta }) => (
                <EcchoTextField
                  type={isShowPassword ? "text" : "password"}
                  label="Passcode"
                  value={field.value}
                  onChange={handleChange(field.name)}
                  onBlur={handleBlur(field.name)}
                  customStyles={{ m: 1, width: "100%" }}
                  isStartAdornment
                  isEndAdornment
                  adornmentElement={[
                    <KeyIcon />,
                    <CheckPasswordIcon
                      {...{ isShowPassword, setShowPassword }}
                    />,
                  ]}
                  isRequired
                  isError={meta.touched && meta.error}
                  helperText={meta.touched && meta.error ? meta.error : ""}
                />
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
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
