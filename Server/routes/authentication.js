const express = require("express");

const router = express.Router();

const {
  signUpController,
  signInController,
} = require("../controllers/authenticationController");

router.route("/sign-up").post(signUpController);
router.route("/sign-in").post(signInController);

module.exports = router;
