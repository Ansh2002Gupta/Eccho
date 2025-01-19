const Users = require("../Schemas/Users");
const Contacts = require("../Schemas/Contacts");

const initiateNewChatEngagement = async (toWhomId, fromWhomId, chatId) => {
  const targetUserDoc = await Users.findById(toWhomId);
  const isLoggedInUser = !!targetUserDoc;
  const sendersData = await Users.findById(fromWhomId);
  if (!sendersData) {
    throw new Error("Server: Failed to fetch sender's data!");
  }
  if (!isLoggedInUser) {
    //TODO: implement guest user flow.
  }
  const contactDocId = targetUserDoc?.Contacts;
  if (!contactDocId) {
    const newContact = await Contacts.create({
      List: [
        {
          _id: fromWhomId,
          ...sendersData?._doc,
          ChatId: chatId,
        },
      ],
    });
    if (!newContact) {
      throw new Error(
        "Internal Error | Failed to create new contact on the receiver end."
      );
    }
    const updatedTargetUserDoc = await Users.findByIdAndUpdate(
      toWhomId,
      {
        $set: { Contacts: newContact?._id },
      },
      { upsert: true }
    );
    if (!updatedTargetUserDoc) {
      throw new Error(
        "Internal Error | Failed to update target user's contact list."
      );
    }
  } else {
    const targetUserContactDoc = await Contacts.findById(contactDocId);
    if (!targetUserContactDoc) {
      throw new Error(
        "Internal Error | Failed to retrieve target user contact list."
      );
    }
    const targetUserContactList = targetUserContactDoc?.List;
    if (!targetUserContactList || targetUserContactList?.length === 0) {
      throw new Error(
        "Internal Error | Failed to retrieve target user contact list."
      );
    }
    const newAdminContactData = {
      _id: fromWhomId,
      ...sendersData?._doc,
      ChatId: chatId,
    };
    targetUserContactList.push(newAdminContactData);
    const updatedloggedInContactContactsDoc = await Contacts.findByIdAndUpdate(
      contactDocId,
      { $set: { List: targetUserContactList } },
      { upsert: true }
    );
    if (!updatedloggedInContactContactsDoc) {
      throw new Error(
        "Internal Error | Failed to update target user contact list"
      );
    }
  }
};

module.exports = { initiateNewChatEngagement };
