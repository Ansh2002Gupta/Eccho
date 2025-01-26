const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { AVAILABILITY_STATUS } = require("../core/ServerConstants");

mongoose.set("debug", true);

//TODO: add a unique check for email and phone number
const CONTACTS = new Schema({
  List: [
    {
      Name: { type: String, default: undefined, required: true },
      Email: { type: String, default: undefined, required: true },
      PhoneNumber: { type: Number, default: undefined, required: true },
      About: { type: String, default: "Indians use Eccho!" },
      ProfilePicture: {
        type: String,
        default: "https://picsum.photos/id/103/1920/1080",
      },
      ChatId: { type: Schema.Types.ObjectId, ref: "UserChats", default: null },
      UnreadMessageDetails: [
        {
          Message: {
            type: String,
            default: "This was the last un-read message.",
          },
          CreatedAt: { type: Date, default: Date.now },
        },
      ],
      Status: { type: String, default: AVAILABILITY_STATUS.OFFLINE },
      CreatedAt: { type: Date, default: Date.now() },
    },
  ],
});

module.exports = mongoose.model("Contacts", CONTACTS);
