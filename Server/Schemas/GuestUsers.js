const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.set("debug", true);

const GUEST_USERS = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  PhoneNumber: { type: Number, required: true, unique: true },
  CreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GuestUsers", GUEST_USERS);
