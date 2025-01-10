const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const USER_CHATS = new Schema({
  Chats: [
    {
      Owner: {type: Schema.Types.ObjectId, ref: 'UserContacts', required: true},
      Message: { type: String, default: null },
      CreatedAt: { type: Date, default: Date.now },
    },
  ],
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserChats", USER_CHATS);
