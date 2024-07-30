const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { AVAILABILITY_STATUS } = require("../core/ServerConstants");

const USERS = new Schema({
  Name: { type: String, default: undefined, required: true },
  Email: { type: String, default: undefined, required: true },
  Password: { type: String, default: undefined, required: true },
  PhoneNumber: { type: Number, default: undefined, required: true },
  About: { type: String, default: "Indians use Eccho!" },
  Status: { type: String, default: AVAILABILITY_STATUS.OFFLINE },
  LastOnline: { type: Date, default: undefined },
  ProfilePicture: {
    type: String,
    default: "https://picsum.photos/id/103/1920/1080",
  },
  Contacts: [{ type: Schema.Types.ObjectId, ref: "UserContacts" }],
  GROUP_CHATS: [{ type: Schema.Types.ObjectId, ref: "GroupChats" }],
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", USERS);
