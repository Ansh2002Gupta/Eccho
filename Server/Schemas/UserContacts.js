const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { AVAILABILITY_STATUS } = require("../core/ServerConstants");

const USER_CONTACTS = new Schema({
  Name: { type: String, default: undefined, required: true},
  Email: { type: String, default: undefined },
  PhoneNumber: { type: Number, default: undefined, required: true},
  About: { type: String, default: "Indians use Eccho!" },
  Status: { type: String, default: AVAILABILITY_STATUS.OFFLINE },
  ProfilePicture: {
    type: String,
    default: "https://picsum.photos/id/103/1920/1080",
  },
  IsConnected: { type: Boolean, default: false },
  Chats: [{ type: Schema.Types.ObjectId, ref: "UserChats" }],
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserContacts", USER_CONTACTS);
