const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../Schemas/Users");
const generateToken = require("../config/generateToken");

const authenticationController = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errors: "I think you forgot to enter username!" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ errors: "I think you forgot to enter email!" });
  }
  if (!phoneNumber) {
    return res
      .status(400)
      .json({ errors: "I think you forgot to enter phone number!" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ errors: "I think you forgot to enter password!" });
  }

  const existingUser = await User.findOne({ Email: email });

  if (existingUser) {
    return res.status(400).json({ message: "This email already exists!" });
  } else {
    const newUser = await User.create({
      Name: username,
      Email: email,
      PhoneNumber: phoneNumber,
      Password: password,
    });
    if (newUser) {
      res.status(201).json({
        ...newUser,
        _id: newUser._id,
        token: generateToken(newUser._id),
      });
    } else {
      res
        .status(400)
        .json({ message: "Sorry! Some error occured, Failed to create user!" });
    }
  }
});

module.exports = { authenticationController };
