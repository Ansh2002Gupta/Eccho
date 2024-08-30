const express = require("express");
const cors = require("cors");
const connectToDB = require("./connections/mongodb");
const dotenv = require("dotenv");
const colors = require("colors");
const authentication = require("./routes/authentication");
const operations = require("./routes/operations");

dotenv.config();
connectToDB().catch(console.dir);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
    method: "GET,HEAD,POST,PATCH,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = process.env.SERVER_PORT;

//?apis' to check if the port is working.
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

//?apis' to perform operations on the database.
app.use("/api/authentication", authentication);
app.use("/api/operations", operations);

app.listen(port, () =>
  console.log("Listing to port".blue.bgWhite.bold, port.red.bgWhite.bold)
);
