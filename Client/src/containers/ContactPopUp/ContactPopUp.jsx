import React, { useEffect, useRef, useState } from "react";

import SmsIcon from "@mui/icons-material/Sms";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { chatMenuItems } from "../ChatMenu/data";
import styles from "./ContactPopUp.module.scss";
import EcchoToolTip from "../../hocs/EcchoToolTip/EcchoToolTip";
import { motion, useAnimation } from "framer-motion";
import AddNewContactPopUp from "../AddNewContactPopUp/AddNewContactPopUp";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducers/apiReducer";
import axios from "axios";
import { appConstants } from "../../config/app_constants";
import Loader from "../../../public/images/Loader.svg";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { setRefetchContacts } from "../../redux/reducers/ChatListReducer";

const ContactPopUp = ({ setPopUpElement, triggerRerender }) => {
  const controls = useAnimation();
  const isLoading = useSelector((state) => state.apiContext.isLoading);
  const adminId = useSelector((state) => state.adminContext.adminId);
  const dispatch = useDispatch();
  const addNewContactRef = useRef();
  const [isAddNewTriggered, setIsAddNewTriggered] = useState(false);
  const [contactList, setContactList] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      fetchContactList();
      isFirstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (triggerRerender && !isFirstRender.current) {
      fetchContactList();
    }
  }, [triggerRerender]);

  const fetchContactList = () => {
    dispatch(setLoading({ isLoading: true }));
    axios({
      method: "get",
      baseURL: appConstants.API_BASE_URL,
      url: `/operations/fetch-contact-list/${adminId}`,
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(
            response?.message ?? "Contact list fetched successfully!",
            response
          );
          setContactList(response?.data?.data?.contacts);
        } else {
          console.log("Failed to fetch contact list!");
        }
      })
      .catch((error) =>
        console.log("Internal Error | failed to fetch contact list!")
      )
      .finally(() => dispatch(setLoading({ isLoading: false })));
  };

  const handleAddContactClicked = () => {
    setIsAddNewTriggered(true);
    setPopUpElement((prev) => [
      ...prev,
      <AddNewContactPopUp
        targetRef={addNewContactRef}
        {...{ setPopUpElement, setIsAddNewTriggered }}
      />,
    ]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start({ x: 70, scale: 0.5 });
          } else {
            controls.start({ x: 0, scale: 1 });
          }
        });
      },
      { threshold: 0.9 }
    );
    if (addNewContactRef.current) {
      observer.observe(addNewContactRef.current);
    }
    return () => {
      if (addNewContactRef.current) {
        observer.unobserve(addNewContactRef.current);
      }
    };
  });

  const initiateChatting = (contactObject) => {
    dispatch(setLoading({ isLoading: true }));
    axios({
      method: "post",
      baseURL: appConstants.API_BASE_URL,
      url: `/operations/start-new-chat`,
      data: {
        contactId: contactObject?._id,
        adminId: adminId,
      },
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 201) {
          dispatch(
            showNotification({
              isVisible: true,
              type: "success",
              message:
                response?.message ?? "Chat stated and listed successfully!",
            })
          );
          setPopUpElement(null);
          dispatch(setRefetchContacts({ isRefetchContacts: true }));
        } else {
          dispatch(
            showNotification({
              isVisible: true,
              type: "error",
              message:
                response?.error ??
                response?.message ??
                "Failed to start and initiate chat!",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message: "Internal Error | Failed to initiate chat!",
          })
        );
      })
      .finally(() => dispatch(setLoading({ isLoading: false })));
  };

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={controls}
      transition={{ type: "spring", stiffness: 150 }}
      className={`${styles.glassContainer}`}
    >
      <div className={`${styles.titleContainer}`}>
        <h1>Your Contacts</h1>
        <motion.button
          className={`${styles.addNewButton}`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 50 }}
          disabled={isAddNewTriggered}
          onClick={handleAddContactClicked}
        >
          <AddCircleIcon />
          <span>Add New</span>
        </motion.button>
      </div>
      <div className={`${styles.listContainer}`}>
        {isLoading ||
          (!contactList && (
            <img src={Loader} alt="loader" className={`${styles.loader}`} />
          ))}
        {!isLoading &&
          Array.isArray(contactList) &&
          contactList.length === 0 && <div>No contacts found so far.</div>}
        {!isLoading &&
          contactList?.map((obj, index) => (
            <div key={index} className={`${styles.contactSlab}`}>
              <div className={`${styles.contactPersonDetails}`}>
                <EcchoToolTip title="Online" position="bottom">
                  <div className={`${styles.availabilityIndicator}`}></div>
                </EcchoToolTip>
                <img
                  src={obj?.ProfilePicture}
                  alt="Contact Person Image"
                  className={`${styles.contactPersonImage}`}
                />
                <div className={`${styles.inCol}`}>
                  <h3 className={`${styles.contactPersonName}`}>{obj?.Name}</h3>
                  <h5 className={`${styles.contactPersonAbout}`}>
                    {obj?.About}
                  </h5>
                </div>
              </div>
              {!obj?.ChatId ? (
                <motion.button
                  className={`${styles.actionButton}`}
                  whileHover={{ scale: 1.2, x: -10 }}
                  whileTap={{ scale: 0.9, x: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 50 }}
                  onClick={() => initiateChatting(obj)}
                >
                  <SmsIcon />
                  <span>Chat</span>
                </motion.button>
              ) : (
                <motion.span
                  className={`${styles.actionButton}`}
                  whileHover={{ scale: 1.2, x: -10 }}
                  whileTap={{ scale: 0.9, x: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 50 }}
                  onClick={() => setPopUpElement(null)}
                >
                  Already ecchoed
                </motion.span>
              )}
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default ContactPopUp;
