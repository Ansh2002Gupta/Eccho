const Contacts = require("../Schemas/Contacts");
const { fetchContactList } = require("./fetchContactList");

const updateUnreadMessages = async (targetUserId) => {
  try {
    const [contactList, contactDocId] = await fetchContactList(targetUserId);
    const updatedContactList = contactList.map((contactObj) => {
      if (contactObj?._id === ownerId) {
        return {
          ...contactObj,
          UnreadMessageDetails: [
            ...contactObj?.UnreadMessageDetails,
            { Message: message },
          ],
        };
      }
      return contactObj;
    });
    await Contacts.findByIdAndUpdate(
      contactDocId,
      { $set: { List: updatedContactList } },
      { upsert: true }
    );
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ internalError: error?.message });
  }
};

module.exports = {
  updateUnreadMessages,
};
