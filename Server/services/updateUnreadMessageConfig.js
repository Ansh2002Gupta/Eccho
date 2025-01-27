const Contacts = require("../Schemas/Contacts");
const { fetchContactList } = require("./fetchContactList");

const updateUnreadMessages = async (message, ownerId, targetUserId) => {
  try {
    const [contactList, contactDocId] = await fetchContactList(targetUserId);
    if (!message) {
      throw new Error("Server: Message is absent in updateUnreadMessage");
    }
    if (!ownerId) {
      throw new Error("Server: Owner is absent in updateUnreadMessage");
    }
    if (!targetUserId) {
      throw new Error("Server: TargetUser is absent in updateUnreadMessage");
    }
    const updatedDoc = await Contacts.findOneAndUpdate(
      {
        _id: contactDocId,
        "List._id": ownerId,
      },
      {
        $push: {
          "List.$.UnreadMessageDetails": { Message: message },
        },
      },
      { new: true }
    );
    if (!updatedDoc)
      throw new Error("Server: UnreadMessageDetails could not be updated");
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ internalError: error?.message });
  }
};

module.exports = {
  updateUnreadMessages,
};
