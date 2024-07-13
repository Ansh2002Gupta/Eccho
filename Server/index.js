const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

//to check if server has started.
app.get("/", (req, res) => {
  console.log("Everything normal!");
});

//to load all the chats.
app.get("/api/chat", (req, res) => {
  console.log("Chat is loading....");
  console.log("res:", res);
});

//to load all the chats of a perticular user.
app.get("/api/chat/:id", (req, res) => {
  console.log("Chat with id(?) id loading....");
});

app.listen(port, () => console.log("Listing to port ", port));
