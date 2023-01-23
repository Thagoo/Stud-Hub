const mongoose = require("mongoose");

const path = require("path");
require("dotenv").config({ path: "./../.env" });

MONGODB_CHATDB_URL = process.env.MONGODB_URL;

mongoose.connect(
  MONGODB_CHATDB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Chat DB connected");
  }
);

const chatSchema = new mongoose.Schema({
  message: String,
  username: String,
  id: String,
  socketID: String,
  time: String,
  room: String,
});

const BCA = new mongoose.model("Bca", chatSchema);
const BCOM = new mongoose.model("Bcom", chatSchema);
const BA = new mongoose.model("BA", chatSchema);

function chat_db_save(data) {
  if (data.room === "bca") {
    var chat = new BCA({
      message: data.message,
      username: data.username,
      id: data.id,
      time: data.time,
      room: data.room,
    });
  } else if (data.room === "bcom") {
    var chat = new BCOM({
      message: data.message,
      username: data.username,
      id: data.id,
      time: data.time,
      room: data.room,
    });
  } else {
    var chat = new BA({
      message: data.message,
      username: data.username,
      id: data.id,
      time: data.time,
      room: data.room,
    });
  }

  //console.log(chat);
  chat.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("message saved in db");
    }
  });
}

async function chat_db_get(room) {
  if (room === "bca") {
    var chats = await BCA.find({}).exec();
  } else if (room === "bcom") {
    var chats = await BCOM.find({}).exec();
  } else {
    var chats = await BA.find({}).exec();
  }

  //console.log(chats);
  return chats;
}

async function chat_db_delete(messageID) {
  Chat.deleteOne({ id: messageID })
    .then(() => {
      console.log("message deleted", messageID);
    })
    .catch((error) => {
      console.log("chat deletion failed", error);
    });
}
module.exports = { chat_db_save, chat_db_get, chat_db_delete };
