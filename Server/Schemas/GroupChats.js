import mongoose from "mongoose";
import { Schema } from "mongoose";
import { USER_ROLES } from "../core/ServerConstants"; // Ensure this is imported correctly

const GROUP_CHATS = new Schema({
  Chats: [
    {
      Owner: { type: Schema.Types.ObjectId, ref: "UserContacts" },
      Message: { type: String, default: undefined },
      CreatedAt: { type: Date, default: Date.now },
    },
  ],
  Participants: [
    {
      User: { type: Schema.Types.ObjectId, ref: "UserContacts" },
      Role: { type: String, default: USER_ROLES.MEMBER },
      CreatedAt: { type: Date, default: Date.now },
    },
  ],
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GroupChats", GROUP_CHATS);
