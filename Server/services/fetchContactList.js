const Contacts = require("../Schemas/Contacts");
const Users = require("../Schemas/Users");

const fetchContactList = async (userId) => {
  if (!userId)
    throw new Error("Server: User ID is required to fetch contact list");
  const contactDocId = await Users.findById(userId).select("Contacts");
  if (!contactDocId) throw new Error("Server: Failed to fetch contact list");
  const userContactList = await Contacts.findById(contactDocId).select("List");
  if (!userContactList) throw new Error("Server: Failed to fetch contact list");
  return [userContactList, contactDocId];
};

module.exports = { fetchContactList };
