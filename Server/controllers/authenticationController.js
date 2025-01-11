const express = require("express");
const asyncHandler = require("express-async-handler");
const Users = require("../Schemas/Users");
const GuestUsers = require("../Schemas/GuestUsers");
const generateToken = require("../config/generateToken");
const colors = require("colors");
const { AVAILABILITY_STATUS } = require("../core/ServerConstants");

const signUpController = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errors: "Eccho: I think you forgot to enter username!" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ errors: "Eccho: I think you forgot to enter email!" });
  }
  if (!phoneNumber) {
    return res
      .status(400)
      .json({ errors: "Eccho: I think you forgot to enter phone number!" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ errors: "Eccho: I think you forgot to enter password!" });
  }

  const existingUser = await Users.findOne({ Email: email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Server: This email already exists!" });
  } else {
    const newToken = generateToken(email);
    //c: if this email is present in my guest user table, then the uid & contacts of that document will be copied over here and that guest user entry is finally deleted.
    const existingGuestUser = await GuestUsers.findOne({ Email: email });
    if (existingGuestUser) {
      try {
        await GuestUsers.findByIdAndDelete(existingGuestUser._id);
      } catch (error) {
        console.error(`Error deleting guest user: ${error.message}`.red.bold);
      }
    }
    const newUser = await Users.create({
      ...(existingGuestUser?._id ? { _id: existingGuestUser?._id } : {}),
      Name: username,
      Email: email,
      PhoneNumber: phoneNumber,
      Password: password,
      ...(!existingGuestUser?.Contacts
        ? {}
        : { Contacts: existingGuestUser?.Contacts }),
      Token: newToken,
    });
    if (newUser) {
      return res.status(201).json({
        message: "Server: User created successfully!",
        _id: newUser._id,
        username: newUser.Name,
        email: newUser.Email,
        phoneNumber: newUser.PhoneNumber,
        createdAt: newUser.CreatedAt,
        authToken: newToken,
      });
    } else {
      return res.status(500).json({
        internalError:
          "Internal Error | Sorry! Some error occured, failed to create user!",
      });
    }
  }
});

const signInController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Eccho: Please provide me a valid email!" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: "Eccho: Password has not been provided!" });
  }

  try {
    const registeredUser = await Users.findOne({ Email: email });

    if (!registeredUser) {
      return res.status(400).json({
        message: "Server: You are a new user! Please sign up to continue.",
      });
    }

    return res.status(200).json({
      message: "Server: Signed in successfully!",
      _id: registeredUser._id,
      username: registeredUser.Name,
      email: registeredUser.Email,
      phoneNumber: registeredUser.PhoneNumber,
      status: AVAILABILITY_STATUS.ONLINE,
      about: registeredUser.About,
      profilePicture: registeredUser.ProfilePicture,
      authToken: registeredUser.Token,
      createdAt: registeredUser.CreatedAt,
    });
  } catch (error) {
    return res.status(400).json({
      internalError: "Internal Error: Some error occurred, Failed to signin",
    });
  }
});

module.exports = { signUpController, signInController };
