const express = require("express");
const asyncHandler = require("express-async-handler");
const Contacts = require("../Schemas/Contacts");
const Users = require("../Schemas/Users");
const UserChats = require("../Schemas/UserChats");
const { initiateNewChatEngagement } = require("../services/newChatEngagement");
const {
  updateUnreadMessages,
} = require("../services/updateUnreadMessageConfig");

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
    const loggedInUser = await Users.findOne({
      PhoneNumber: phoneNumber,
    });
    if (!loggedInUser) {
      //TODO: implement the logic of guest user.
    }
    const loggedInUserId = loggedInUser._id;
    const contactId = adminDBData?.Contacts;
    if (!contactId) {
      const newContact = await Contacts.create({
        List: [
          {
            _id: loggedInUserId,
            Name: name,
            Email: email,
            PhoneNumber: phoneNumber,
            ChatId: null,
          },
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
        data: { contact: newContact },
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
        ChatId: null,
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
          ChatId: null,
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
        data: { contacts: [] },
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
      data: { contacts: contactList },
    });
  } catch (error) {
    return res.status(500).json({
      internalError: "Internal Error | Failed to fetch contact list.",
    });
  }
});

//TODO: if the contact has already engaged with the current admin, then adminId.Contacts will not be null, so we should not create a new chat, instead we should return the existing chat id. If the contact has not engaged with the current admin, then we should create a new chat.
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
      return res.status(500).json({
        internalError: "Internal Error | Failed to initialize a new chat.",
      });
    }
    const adminDoc = await Users.findById(adminId);
    if (!adminDoc) {
      return res.status(404).json({
        error: "Server: Admin ID does not exists",
      });
    }
    const adminContactsId = adminDoc?.Contacts;
    if (!adminContactsId) {
      return res.status(500).json({
        internalError:
          "Internal Error | Failed to retrieve contact information",
      });
    }
    const contactDoc = await Contacts.findById(adminContactsId);
    if (!contactDoc) {
      return res.status(500).json({
        internalError:
          "Internal Error | Failed to retrieve contact information",
      });
    }
    const contactList = contactDoc?.List;
    if (!contactList || contactList.length === 0) {
      return res.status(500).json({
        internalError:
          "Internal Error | Failed to retrieve contact information",
      });
    }
    const updatedList = contactList?.map((contact) => {
      if (contact?._id.toString() === contactId.toString()) {
        return { ...contact?._doc, ChatId: newChatDocument?._id };
      }
      return contact;
    });
    const updatedContactDoc = await Contacts.updateOne(
      { _id: adminContactsId },
      { $set: { List: updatedList } },
      { upsert: true }
    );
    if (!updatedContactDoc) {
      return res.status(500).json({
        internalError: "Internal Error | Failed to update contact's chat id",
      });
    }
    return res.status(201).json({
      message: "Server: Chat initialized successfully!",
      ChatId: newChatDocument?._id,
    });
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
    const adminDoc = await Users.findById(adminId);
    if (!adminDoc) {
      return res.status(404).json({
        error: "Server: Admin ID does not exists",
      });
    }
    const adminContactsId = adminDoc?.Contacts;
    if (!adminContactsId) {
      return res.status(200).json({
        message: "Server: No contacts found",
        data: { engagedContacts: [] },
      });
    }
    const contactDoc = await Contacts.findById(adminContactsId);
    if (!contactDoc) {
      return res.status(500).json({
        internalError:
          "Internal Error | Failed to retrieve contact information",
      });
    }
    const contactList = contactDoc?.List;
    if (!contactList || !contactList.length) {
      return res.status(200).json({
        message: "Server: No contacts found",
        data: { engagedContacts: [] },
      });
    }
    const engagedContacts = contactList.filter((contact) => contact?.ChatId);
    if (!engagedContacts) {
      return res.status(200).json({
        message: "Server: No engaged contacts found",
        data: { engagedContacts: [] },
      });
    }
    return res.status(200).json({
      message: "Successfully fetched chat list!",
      data: { engagedContacts },
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
  const { chatId, ownerId, message, targetUserId } = req.body;
  if (!ownerId) {
    return res.status(400).json({ error: "Owner Id is missing!" });
  }
  if (!message) {
    return res.status(400).json({ error: "Message is missing!" });
  }
  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is missing!" });
  }
  if (!targetUserId) {
    return res.status(400).json({ error: "Target User Id is missing!" });
  }
  try {
    const existingChat = await UserChats.findById(chatId);
    if (!existingChat) {
      return res.status(404).json({ error: "No such chat exists!" });
    }
    if (existingChat?.Chats?.length === 0) {
      try {
        await initiateNewChatEngagement(targetUserId, ownerId, chatId);
      } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ internalError: error?.message });
      }
    }
    existingChat.Chats.push({
      Message: message,
      Owner: ownerId,
    });
    await existingChat.save();
    await updateUnreadMessages(message, ownerId, targetUserId);
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
