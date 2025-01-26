import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ChatSlab from "../../components/ChatSlab/index";
import { showNotification } from "../../redux/reducers/notificationReducer";
import styles from "./ChatMenu.module.scss";
import { setLoading } from "../../redux/reducers/apiReducer";
import { appConstants } from "../../config/app_constants";
import Loader from "../../../public/images/Loader.svg";
import {
  setList,
  setRefetchContacts,
} from "../../redux/reducers/ChatListReducer";

const ChatMenu = ({ setPartnerInfo }) => {
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(undefined);
  const adminId = useSelector((state) => state.adminContext.adminId);
  const isLoading = useSelector((state) => state.notificationContext.isLoading);
  const engagedContacts = useSelector(
    (state) => state.chatListContext.engagedContacts
  );
  const isRefetchContacts = useSelector(
    (state) => state.chatListContext.isRefetchContacts
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      fetchEngagedContacts();
      isFirstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isFirstRender.current && !isLoading && isRefetchContacts) {
      fetchEngagedContacts();
      dispatch(setRefetchContacts({ isRefetchContacts: false }));
    }
  }, [isRefetchContacts]);

  const fetchEngagedContacts = async () => {
    dispatch(setLoading({ isLoading: true }));
    axios({
      method: "get",
      baseURL: appConstants.API_BASE_URL,
      url: `/operations/fetch-engaged-contacts/${adminId}`,
      withCredentials: true,
    })
      .then((response) => {
        dispatch(
          setList({ contactList: response?.data?.data?.engagedContacts })
        );
        dispatch(
          showNotification({
            isVisible: true,
            type: "success",
            message:
              response?.message ?? "Engaged contacts fetched successfully!",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message:
              error?.response?.data?.message ??
              "Failed to fetch engaged contacts!",
          })
        );
      })
      .finally(() => dispatch(setLoading({ isLoading: false })));
  };

  const handleClick = (contactPersonInfo) => {
    const {
      _id: id,
      Name: name,
      Email: email,
      PhoneNumber: phNumber,
      About: about,
      Status: status,
      ProfilePicture: profilePic,
      ChatId: chatId,
      CreatedAt: dateConnected,
    } = contactPersonInfo;

    setActiveId(id);
    setPartnerInfo({
      partnerId: id,
      partnerName: name,
      partnerEmail: email,
      partnerPhoneNumber: phNumber,
      partnerAbout: about,
      partnerStatus: status,
      partnerProfilePicture: profilePic,
      partnerChatId: chatId,
      partnerDateConnected: dateConnected,
    });
  };

  return (
    <div className={`${styles.parentContainer}`}>
      {isLoading && (
        <div className={`${styles.noEngagedContactsContainer}`}>
          <img src={Loader} alt={"Loading..."} className={`${styles.loader}`} />
        </div>
      )}
      {
        //TODO: UPGRADE THE NOENGAGED_CONTACT_CONTAINER
        !isLoading && !!engagedContacts && engagedContacts?.length === 0 && (
          <div className={`${styles.noEngagedContactsContainer}`}>
            <p className={`${styles.unEcchoedStmt}`}>
              You are still unecchoed!
            </p>
          </div>
        )
      }
      {!isLoading &&
        !!engagedContacts &&
        (Array.isArray(engagedContacts) ? engagedContacts : [])?.map((item) => (
          <ChatSlab
            contactPersonInfo={item}
            isActive={activeId === item?._id}
            onClick={handleClick}
          />
        ))}
    </div>
  );
};

export default ChatMenu;
