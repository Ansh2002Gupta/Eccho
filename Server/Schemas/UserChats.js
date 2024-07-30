import mongoose from "mongoose";
import { Schema } from "mongoose";

const USER_CHATS = new Schema({
  Chats: [
    {
      Owner: { type: Schema.Types.ObjectId, ref: "UserContacts" },
      Message: { type: String, default: undefined },
      CreatedAt: { type: Date, default: Date.now },
    },
  ],
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserChats", USER_CHATS);
