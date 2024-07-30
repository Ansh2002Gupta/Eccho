const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged the deployment. I am successfully connected to MongoDB!".yellow
        .italic
    );
  } finally {
    await client.close();
  }
}

module.exports = connectToDB;
