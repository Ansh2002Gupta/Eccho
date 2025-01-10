const express = require("express");
const {
  newContactController,
  getContactList,
  startChatController,
  fetchChatList,
  fetchChats,
  sendMessageController,
} = require("../controllers/operationController");

router = express.Router();

router.route("/add-new-contact").post(newContactController);
router.route("/fetch-contact-list/:adminId").get(getContactList);
router.route("/start-new-chat").post(startChatController);
router.route("/fetch-engaged-contacts/:adminId").get(fetchChatList);
router.route("/fetch-chats/:chatId").get(fetchChats);
router.route("/send-message").post(sendMessageController);

module.exports = router;
