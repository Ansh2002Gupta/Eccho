const express = require("express");
const asyncHandler = require("express-async-handler");
const UserContacts = require("../Schemas/UserContacts");
const Contacts = require("../Schemas/Contacts");
const Users = require("../Schemas/Users");
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
  try {
    const adminDBData = await Users.findById(adminId);
    if (!adminDBData) {
      return res.status(404).json({
        error: "Server: Admin Id not found.",
      });
    }
    const contactId = adminDBData?.Contacts;
    if (!contactId) {
      const newContact = await Contacts.create({
        List: [
          { Name: name, Email: email, PhoneNumber: phoneNumber, chatId: null },
        ],
      });
      if (!newContact) {
        return res.status(500).json({
          internalError: "Internal Error | Failed to create new contact.",
        });
      }
      const updatedAdminDoc = await Users.findByIdAndUpdate(
        adminId,
        { $set: { Contacts: newContact?._id } },
        { new: true }
      );
      if (!updatedAdminDoc) {
        return res.status(500).json({
          internalError:
            "Internal Error | Failed to update admin's contact list.",
        });
      }
      return res.status(201).json({
        message: "Server: Contact created successfully!",
        contact: newContact,
      });
    } else {
      const adminContactsDoc = await Contacts.findById(contactId);
      if (!adminContactsDoc) {
        return res.status(404).json({
          error: "Server: Contact Id does not exist.",
        });
      }
      const contactList = adminContactsDoc?.List;
      const existingContact = contactList?.find(
        (contact) => contact.PhoneNumber === phoneNumber
      );
      if (existingContact) {
        return res
          .status(409)
          .json({ message: "Server: This contact already exists!" });
      }
      const newEntry = {
        Name: name,
        Email: email,
        PhoneNumber: phoneNumber,
        chatId: null,
      };
      contactList.push(newEntry);
      const updatedAdminContactsDoc = await Contacts.updateOne(
        { _id: contactId },
        { $set: { List: contactList } },
        { upsert: true }
      );
      if (!updatedAdminContactsDoc) {
        return res.status(500).json({
          internalError:
            "Internal Error | Failed to update admin's contact list.",
        });
      } else {
        return res.status(201).json({
          message: "Server: New contact added successfully!",
          _id: newEntry._id,
          Name: newEntry.Name,
          Email: newEntry.Email,
          PhoneNumber: newEntry.PhoneNumber,
          chatId: null,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      internalError: "Internal Error | Failed to create new contact.",
    });
  }
});

const getContactList = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) {
    return res.status(400).json({ error: "Server: Admin ID is required!" });
  }
  try {
    const adminDBData = await Users.findById(adminId);
    if (!adminDBData) {
      return res.status(404).json({
        error: "Server: Admin Id not found.",
      });
    }
    const contactId = adminDBData?.Contacts;
    if (!contactId) {
      return res.status(200).json({
        message: "Server: No contacts found for this admin.",
      });
    }
    const adminContactsDoc = await Contacts.findById(contactId);
    if (!adminContactsDoc) {
      return res.status(404).json({
        error: "Server: Contact Id does not exist.",
      });
    }
    const contactList = adminContactsDoc?.List;
    if (!contactList || contactList?.length === 0) {
      return res.status(404).json({
        error: "Server: No contacts found in the contact list.",
      });
    }
    return res.status(200).json({
      message: "Server: Contact list fetched successfully!",
      contacts: contactList,
    });
  } catch (error) {
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
