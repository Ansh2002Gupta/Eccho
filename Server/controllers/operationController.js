const express = require("express");
const asyncHandler = require("express-async-handler");
const UserContacts = require("../Schemas/UserContacts");
const UserChats = require("../Schemas/UserChats");

const newContactController = asyncHandler(async (req, res) => {
  const { adminId, name, email, phoneNumber } = req.body;

  if (!adminId) {
    return res
      .status(422)
      .json({ error: "Server: I think you forgot to enter adminId" });
  }

  if (!email) {
    return res
      .status(422)
      .json({ error: "Server: I think you forgot to enter email" });
  }

  if (!name) {
    return res
      .status(422)
      .json({ error: "Server: I think you forgot to enter contact name." });
  }

  if (!phoneNumber) {
    return res.status(422).json({
      error: "Server: I think you forgot to enter contact phone number.",
    });
  }

  const existingContact = await UserContacts.findOne({
    PhoneNumber: phoneNumber,
  });

  if (existingContact) {
    if (Object.keys(existingContact.ConnectInfo).includes(adminId))
      return res
        .status(409)
        .json({ error: "Server: This contact already exists for this user!" });

    const updatedContact = await UserContacts.updateOne(
      { PhoneNumber: phoneNumber },
      { $set: { [`ConnectInfo.${adminId}`]: null } },
      { upsert: true }
    );
    if (updatedContact) {
      return res.status(200).json({
        message: "Server: Updated existing contact's connection info!",
        _id: existingContact._id,
        name: existingContact.Name,
        email: existingContact.Email,
        phoneNumber: existingContact.PhoneNumber,
        connectInfo: existingContact.ConnectInfo,
      });
    } else {
      return res.status(500).json({
        internalError: "Internal Error | Failed to update existing contact.",
      });
    }
  }

  const newContact = await UserContacts.create({
    Name: name,
    Email: email,
    PhoneNumber: phoneNumber,
    ConnectInfo: { [adminId]: null },
  });

  if (newContact) {
    return res.status(201).json({
      message: "Server: Contact saved successfully!",
      _id: newContact._id,
      name: newContact.Name,
      email: newContact.Email,
      phoneNumber: newContact.PhoneNumber,
      connectInfo: newContact.ConnectInfo,
    });
  } else {
    return res.status(500).json({
      internalError: "Internal Error | Sorry! failed to add this contact.",
    });
  }
});

const getContactList = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  console.log("adminId:", adminId);
  try {
    const contacts = await UserContacts.find({
      [`ConnectInfo.${adminId}`]: { $exists: true },
    });
    console.log("here");
    return res.status(200).json({
      message: "Successfully fetched contact list!",
      contacts: contacts,
    });
  } catch (error) {
    console.log("error here");
    return res.status(500).json({
      internalError: "Internal Error | Failed to fetch contact list.",
    });
  }
});

//TODO: if the contact has already engaged with the current admin, then connectInfo[adminId] will not be null, so we should not create a new chat, instead we should return the existing chat id. If the contact has not engaged with the current admin, then we should create a new chat.
const startChatController = asyncHandler(async (req, res) => {
  const { contactId, adminId } = req.body;

  if (!contactId) {
    return res.status(400).json({ error: "Server: Contact ID is missing!" });
  }

  if (!adminId) {
    return res.status(400).json({ error: "Server: Admin ID is missing!" });
  }

  try {
    const newChatDocument = await UserChats.create({
      Chats: [],
    });

    if (!newChatDocument) {
      return res
        .status(500)
        .json({ internalError: "Internal Error | Failed to start new chat." });
    }

    const updatedContact = await UserContacts.findByIdAndUpdate(
      contactId,
      { $set: { [`ConnectInfo.${adminId}`]: newChatDocument?._id } },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: "Server: Contact not found!" });
    }

    return res
      .status(201)
      .json({ message: "Successfully started new chat!", chatId: contactId });
  } catch (error) {
    return res
      .status(500)
      .json({ internalError: "Internal Error | Failed to start new chat." });
  }
});

const fetchChatList = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).json({ error: "Server: User ID is missing!" });
  }

  try {
    const engagedContacts = await UserContacts.find({
      [`ConnectInfo.${adminId}`]: { $exists: true, $ne: null },
    });
    //TODO: if no engaged contacts are found, then we should not through any api error, instead it should be handled on the frontend. If the api fails, due to a certain network issue or any other issue, then it should through an error.
    if (!engagedContacts) {
      return res
        .status(404)
        .json({ error: "Server: No engaged contacts found!" });
    }
    const refactoredContacts = engagedContacts.map((document) => {
      const doc = document._doc;
      const chatId = doc.ConnectInfo[adminId];
      const { ConnectInfo, ...otherFields } = doc;
      return {
        ...otherFields,
        ChatId: chatId,
      };
    });
    return res.status(200).json({
      message: "Successfully fetched chat list!",
      engagedContacts: refactoredContacts,
    });
  } catch (error) {
    return res.status(500).json({
      internalError: "Internal Error | Failed to fetch engaged chat list.",
    });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ error: "Server: Chat ID is missing!" });
  }

  try {
    const existingChat = await UserChats.findById({ _id: chatId });

    if (!existingChat) {
      return res.status(404).json({ error: "Server: No such chat exists!" });
    }

    return res
      .status(200)
      .json({ message: "Successfully fetched chat list!", data: existingChat });
  } catch (error) {
    return res
      .status(500)
      .json({ internalError: "Internal Error | Failed to fetch chat." });
  }
});

const sendMessageController = asyncHandler(async (req, res) => {
  const { chatId, ownerId, message } = req.body;

  if (!ownerId) {
    return res.status(400).json({ error: "Owner Id is missing!" });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is missing!" });
  }

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is missing!" });
  }

  try {
    const existingChat = await UserChats.findById(chatId);

    if (!existingChat) {
      return res.status(404).json({ error: "No such chat exists!" });
    }

    existingChat.Chats.push({
      Message: message,
      Owner: ownerId,
    });

    await existingChat.save();

    return res.status(200).json({ message: "Message sent to database." });
  } catch (error) {
    return res
      .status(500)
      .json({ internalError: "Internal Error | Failed to send message." });
  }
});

module.exports = {
  newContactController,
  getContactList,
  startChatController,
  fetchChatList,
  fetchChats,
  sendMessageController,
};
