import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";

import EcchoToolTip from "../../hocs/EcchoToolTip/index";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import FolderIcon from "@mui/icons-material/Folder";
import UtilityWrapper from "../../components/UtilityWrapper/UtilityWrapper";
import loader from "../../../public/images/Loader.svg";
import SendIcon from "@mui/icons-material/Send";
import { listOfMessages } from "./data";
import { MESSAGE_TYPE } from "../../core/AppConstants";
import styles from "./ChatArea.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducers/apiReducer";
import { appConstants } from "../../config/app_constants";
import { showNotification } from "../../redux/reducers/notificationReducer";
import axios from "axios";
import { formatTime } from "../../utility/dateTimeService";

const ChatArea = ({ partnerInfo }) => {
  const isLoading = useSelector((state) => state.apiContext.isLoading);
  const [chatList, setChatList] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const adminId = useSelector((state) => state.adminContext.adminId);
  const profilePicture = useSelector(
    (state) => state.adminContext.profilePicture
  );
  const dispatch = useDispatch(undefined);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!partnerInfo) return;
    fetchChats({ isInitializeConnection: true });
  }, [partnerInfo]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    newSocket.emit("setup-socket-connection", adminId);
    newSocket.on("connected-successfully", () =>
      console.log("*****Socket Connection Succssfull*****")
    );

    return () => {
      newSocket.disconnect();
    };
  }, [adminId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("is-new-message-received", handleNewMessage);
    return () => {
      socket.off("is-new-message-received", handleNewMessage);
    };
  });

  const handleNewMessage = (senderId, recepientId, intendedChatId) => {
    if (recepientId === adminId) {
      dispatch(
        showNotification({
          isVisible: true,
          type: "info",
          message: "New message received!",
        })
      );
    }
    if (partnerInfo?.partnerChatId === intendedChatId) {
      fetchChats({ isInitializeConnection: false });
    } else updateChatMenu();
  };

  const updateChatMenu = () => {};

  const fetchChats = async ({ isInitializeConnection = true }) => {
    dispatch(setLoading(true));
    axios({
      method: "get",
      baseURL: appConstants.API_BASE_URL,
      url: `/operations/fetch-chats/${partnerInfo?.partnerChatId}`,
      withCredentials: true,
    })
      .then((response) => {
        setChatList(response.data.data.Chats);
        if (isInitializeConnection)
          socket.emit("join-chat-room", partnerInfo?.partnerChatId, adminId);
      })
      .catch((error) => {
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message:
              error?.message ?? error?.internalError ?? "Some error occured!",
          })
        );
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const sendMessage = () => {
    dispatch(setLoading(true));
    axios({
      method: "post",
      baseURL: appConstants.API_BASE_URL,
      url: "/operations/send-message",
      data: {
        chatId: partnerInfo?.partnerChatId,
        ownerId: adminId,
        message: message,
        targetUserId: partnerInfo?.partnerId,
      },
      withCredentials: true,
    })
      .then((_) => {
        socket.emit(
          "is-new-message-sent",
          partnerInfo?.partnerChatId,
          adminId,
          partnerInfo?.partnerId
        );
        setMessage("");
        fetchChats({ isInitializeConnection: false });
      })
      .catch((error) =>
        dispatch(
          showNotification({
            isVisible: true,
            type: "error",
            message:
              error?.message ?? error?.internalError ?? "Some error occured!",
          })
        )
      )
      .finally(() => dispatch(setLoading(false)));
  };

  const renderDateSlab = (message, index, chatList) => {
    const dateOfCurrentMessage = new Date(message?.CreatedAt);
    const dateOfPreviousMessage = new Date(chatList[index - 1]?.CreatedAt);

    if (
      dateOfCurrentMessage.toDateString() ===
      dateOfPreviousMessage.toDateString()
    )
      return <></>;

    const today = new Date();
    const yesterday = new Date();
    let resultantDateString = "";
    if (dateOfCurrentMessage.toDateString() === today.toDateString()) {
      resultantDateString = "Today";
    } else if (
      dateOfCurrentMessage.toDateString() === yesterday.toDateString()
    ) {
      resultantDateString = "Yesterday";
    } else {
      resultantDateString = dateOfCurrentMessage.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return (
      <div className={`${styles.dateIdentifier}`}>
        <span className={`${styles.dateStyling}`}>
          {resultantDateString ?? "<!!Error in date formatting!!>"}
        </span>
      </div>
    );
  };

  const renderChats = () => {
    if (!chatList || chatList.length === 0) return <></>;

    return chatList?.map((msg, index) => (
      <>
        {renderDateSlab(msg, index, chatList)}
        <div
          key={index}
          className={`${
            msg?.Owner === adminId
              ? styles.inRow_messages_outgoing
              : styles.inRow_messages_incoming
          }`}
        >
          <img
            src={
              msg?.Owner === adminId
                ? profilePicture
                : partnerInfo?.partnerProfilePicture
            }
            alt="profile photo"
            className={`${styles.profilePhotoContainer_messaging_area} ${
              index > 0 &&
              msg?.Owner === chatList[index - 1]?.Owner &&
              styles.profilePhotoContainer_messaging_area_hidden
            }`}
          />
          <div
            className={`${styles.messageContainer} ${
              msg?.Owner === adminId
                ? styles.extraStyling_messageContainer_incoming
                : null
            }`}
          >
            <p className={`${styles.message}`}>{msg?.Message}</p>
          </div>
          <div className={`${styles.time}`}>{formatTime(msg?.CreatedAt)}</div>
        </div>
      </>
    ));
  };

  return (
    <div className={`${styles.parentContainer}`}>
      <div className={`${styles.userContainerWrapper}`}>
        <div className={`${styles.userContainer}`}>
          <img
            src={
              partnerInfo?.partnerProfilePicture ??
              "https://picsum.photos/id/101/1920/1080"
            }
            alt="profile photo"
            className={`${styles.profilePhotoContainer}`}
          />
          <div className={`${styles.inColumn}`}>
            <h4 className={`${styles.userName}`}>
              {partnerInfo?.partnerName ?? "Elon Musk"}
            </h4>
            <div className={`${styles.inRow}`}>
              <div className={`${styles.dot}`}></div>
              <h6 className={`${styles.onlineStatus}`}>
                {partnerInfo?.partnerStatus ?? "Online"}
              </h6>
            </div>
          </div>
        </div>
        <div className={`${styles.inRow}`}>
          <EcchoToolTip title="Video Call" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <VideoCameraFrontIcon
                fontSize="medium"
                htmlColor="var(--primary)"
              />
            </div>
          </EcchoToolTip>
          <EcchoToolTip title="Phone Call" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <CallIcon fontSize="medium" htmlColor="var(--primary)" />
            </div>
          </EcchoToolTip>
          <EcchoToolTip title="Files" position="bottom">
            <div className={`${styles.extraServicesIcon}`}>
              <FolderIcon fontSize="medium" htmlColor="var(--primary)" />
            </div>
          </EcchoToolTip>
        </div>
      </div>
      <div className={`${styles.messagingAreaWrapper}`}>
        <div className={`${styles.messagingArea}`}>
          {isLoading && (
            <>
              <div className={`${styles.overlay}`}></div>
              <img
                src={loader}
                alt="Loading..."
                className={`${styles.loaderImage}`}
              />
            </>
          )}
          {!isLoading && renderChats()}
        </div>
      </div>
      <div className={`${styles.inputArea}`}>
        <div className={`${styles.inRow}`}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here...."
            className={`${styles.messageBox}`}
          />
          <UtilityWrapper />
          <EcchoToolTip title="Send Message" position="top">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`${styles.sendButton}`}
              onClick={() => sendMessage()}
            >
              <SendIcon fontSize="medium" htmlColor="var(--primary)" />
            </motion.div>
          </EcchoToolTip>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
