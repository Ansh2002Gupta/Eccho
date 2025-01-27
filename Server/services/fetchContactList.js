const Contacts = require("../Schemas/Contacts");
const Users = require("../Schemas/Users");

const fetchContactList = async (userId) => {
  if (!userId)
    throw new Error("Server: User ID is required to fetch contact list");
  const contactDoc = await Users.findById(userId);
  if (!contactDoc) throw new Error("Server: Failed to fetch contact document");
  const contactDocId = contactDoc?.Contacts;
  if (!contactDocId) return [null, null];
  const userContactDoc = await Contacts.findById(contactDocId);
  if (!userContactDoc)
    throw new Error("Server: No matching contactDocId found!");
  const userContactList = userContactDoc?.List;
  if (!userContactList) throw new Error("Server: Failed to fetch contact list");
  return [userContactList, contactDocId];
};

module.exports = { fetchContactList };
