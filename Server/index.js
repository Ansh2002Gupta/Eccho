const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.listen(port, () => console.log("Listing on port ", port));
