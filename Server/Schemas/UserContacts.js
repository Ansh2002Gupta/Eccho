import mongoose from "mongoose";
import { Schema } from "mongoose";
import { AVAILABILITY_STATUS } from "../core/ServerConstants"; // Ensure this is imported correctly

const USER_CONTACTS = new Schema({
  Name: { type: String, default: undefined },
  Email: { type: String, default: undefined },
  PhoneNumber: { type: Number, default: undefined },
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
