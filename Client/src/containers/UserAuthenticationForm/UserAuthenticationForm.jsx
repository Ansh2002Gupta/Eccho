import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
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
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { appConstants } from "../../config/app_constants";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../redux/reducers/notificationReducer";
import Loader from "../../../public/images/Loader.svg";
import { setLoading } from "../../redux/reducers/apiReducer";
import {
  setAdminData,
  setOtherDetails,
} from "../../redux/reducers/adminReducer";

const UserAuthenticationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formikRef = useRef();
  const apiState = {
    isIdeal: useSelector((state) => state.apiContext.isIdeal),
    isPending: useSelector((state) => state.apiContext.isPending),
    isLoading: useSelector((state) => state.apiContext.isLoading),
  };
  const [isSignIn, setIsSignIn] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [hasAcceptedTermsConditions, setHasAcceptedTermsConditions] =
    useState(false);

  useEffect(() => {
    if (location) {
      setIsSignIn(location.pathname === routes.SIGNIN);
    }
  }, [location]);

  return (
    <>
      <div className={`${styles.formContainer}`}>
        <h1 className={`${styles.heading}`}>
          {isSignIn ? "Welcome back!" : "Create Your Account"}
        </h1>
        <h3 className={`${styles.subHeading}`}>Made for Bharat, by Bharat</h3>
        <div className={`${styles.formWrapper}`}>
          {isSignIn ? (
            <SignInForm {...{ setIsFormDirty, formikRef }} />
          ) : (
            <SignUpForm {...{ setIsFormDirty, formikRef }} />
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
        {apiState.isLoading ? (
          <AnimatePresence>
            <motion.div
              className={`${styles.loaderContainer}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.1,
                delay: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <img src={Loader} alt="loader" className={`${styles.loader}`} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.button
              type="submit"
              className={`${styles.submitButton}`}
              disabled={
                isFormDirty || (!isSignIn && !hasAcceptedTermsConditions)
              }
              onClick={() => formikRef.current.submitForm()}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </motion.button>
          </AnimatePresence>
        )}
        <div className={`${styles.footerSentence}`}>
          <h3 className={`${styles.doNotHaveAccount}`}>
            {isSignIn ? "Don't have an account ?" : "Already have an account ?"}
            <button
              className={`${styles.footerSentenceButton}`}
              onClick={() => {
                setIsSignIn((prev) => !prev);
                navigate(isSignIn ? "/sign-up" : "/sign-in");
              }}
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

const SignUpForm = ({ setIsFormDirty, formikRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialFormValues = {
    userName: "",
    email: "",
    phoneNumber: "",
    passCode: "",
  };
  const [isShowPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken") !== null) {
      navigate(routes.CHATS);
      dispatch(
        showNotification({
          isVisible: true,
          type: "success",
          message: "Signed in successfully!",
          adornmentImage: Loader,
        })
      );
      dispatch(setAdminData({
        id: localStorage.getItem('adminId'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        phoneNumber: localStorage.getItem('phoneNumber'),
      }));
      dispatch(setOtherDetails({
        about: localStorage.getItem('about'),
        profilePicture: localStorage.getItem('profilePicture'),
        status: localStorage.getItem('status'),
      }))
    }
  }, []);

  const handleFormSubmission = (values, action) => {
    dispatch(setLoading({ isLoading: true }));
    axios({
      method: "post",
      baseURL: appConstants.API_BASE_URL,
      url: "/authentication/sign-up",
      data: {
        username: values.userName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.passCode,
      },
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 201) {
          dispatch(
            showNotification({
              isVisible: true,
              type: "success",
              message: response.message ?? "Account created successfully!",
              adornmentImage: Loader,
            })
          );
          navigate(routes.SIGNIN);
        } else {
          dispatch(
            showNotification({
              isVisible: true,
              type: "error",
              message:
                response.error ?? response.message ?? "Some error occurred!",
              adornmentImage: Loader,
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message:
              error?.response?.data?.message ?? "Some Internal Server Occured!",
            adornmentImage: Loader,
          })
        );
      })
      .finally(() => dispatch(setLoading({ isLoading: false })));
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={SignUpSchema}
      onSubmit={handleFormSubmission}
      innerRef={formikRef}
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

const SignInForm = ({ setIsFormDirty, formikRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialFormValues = {
    email: "",
    passCode: "",
  };
  const [isShowPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken") !== null) {
      navigate(routes.CHATS);
      dispatch(
        showNotification({
          isVisible: true,
          type: "success",
          message: "Signed in successfully!",
          adornmentImage: Loader,
        })
      );
      dispatch(setAdminData({
        id: localStorage.getItem('adminId'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        phoneNumber: localStorage.getItem('phoneNumber'),
      }));
      dispatch(setOtherDetails({
        about: localStorage.getItem('about'),
        profilePicture: localStorage.getItem('profilePicture'),
        status: localStorage.getItem('status'),
      }));
    }
  }, []);

  const handleFormSubmission = (values, action) => {
    dispatch(setLoading({ isLoading: true }));
    axios({
      method: "post",
      baseURL: appConstants.API_BASE_URL,
      url: "/authentication/sign-in",
      data: {
        email: values.email,
        password: values.passCode,
      },
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("authToken", response?.data?.authToken);
          localStorage.setItem('adminId', response.data?._id);
          localStorage.setItem('name', response?.data?.username);
          localStorage.setItem('email', response?.data?.phoneNumber);
          localStorage.setItem('about', response?.data?.about);
          localStorage.setItem('profilePicture', response?.data?.profilePicture);
          localStorage.setItem('status', response?.data?.status);
          dispatch(
            setAdminData({
              id: response?.data?._id,
              name: response?.data?.username,
              email: response?.data?.email,
              phoneNumber: response?.data?.phoneNumber,
            })
          );
          dispatch(
            setOtherDetails({
              about: response?.data?.about,
              profilePicture: response?.data?.profilePicture,
              status: response?.data?.status,
            })
          );
          dispatch(
            showNotification({
              isVisible: true,
              type: "success",
              message: response?.message ?? "Signed in successfully!",
              adornmentImage: Loader,
            })
          );
          navigate(routes.CHATS);
        } else {
          dispatch(
            showNotification({
              isVisible: true,
              type: "error",
              message:
                response.error ?? response?.message ?? "Some error occurred!",
              adornmentImage: Loader,
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message: error?.response?.data?.message ?? "Some error occurred!",
            adornmentImage: Loader,
          })
        );
      })
      .finally(() => dispatch(setLoading({ isLoading: false })));
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={SignInSchema}
      onSubmit={handleFormSubmission}
      innerRef={formikRef}
    >
      {({ handleChange, handleBlur }) => {
        return (
          <Form>
            <FormObserver
              setIsFormDirty={setIsFormDirty}
              totalFieldsOfForm={2}
            />
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
