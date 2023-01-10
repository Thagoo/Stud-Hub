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
});

const Chat = new mongoose.model("Chat", chatSchema);

function chat_db_save(data) {
  const chat = new Chat({
    message: data.message,
    username: data.username,
    id: data.id,
    time: data.time,
  });
  console.log(chat);
  chat.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("message saved in db");
    }
  });
}

async function chat_db_get() {
  let chats = await Chat.find({}).exec();
  //console.log(chats);
  return chats;
}
module.exports = { chat_db_save, chat_db_get };
