const express = require("express");
const cors = require("cors");
const connectToDB = require("./connections/mongodb");
const dotenv = require("dotenv");
const http = require("http");
const colors = require("colors");
const authentication = require("./routes/authentication");
const operations = require("./routes/operations");
const { Server } = require("socket.io");

dotenv.config();
connectToDB().catch(console.dir);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
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

//implementing socket.io interface
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected to: ${socket.id}`.yellow.bgBlack.bold);

  socket.on("setup-socket-connection", (adminId) => {
    console.log(`Admin connected: ${adminId}`);
    socket.join(adminId);
    socket.emit("connected-successfully");
  });

  socket.on("join-chat-room", (chatId, adminId) => {
    console.log(`Admin ${adminId}, joined chat ${chatId}`);
    socket.join(chatId);
  });

  socket.on("is-new-message-sent", (chatId, senderId, receiverId) => {
    console.log(
      `socket sent a message for chat: ${chatId} (${senderId} -> ${receiverId})`
    );
    io.to(chatId).emit("is-new-message-received", receiverId, senderId);
  });
});

server.listen(port, () =>
  console.log("Listing to port".blue.bgWhite.bold, port.red.bgWhite.bold)
);
