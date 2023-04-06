const {
  chat_db_save,
  chat_db_get,
  chat_db_delete,
  chat_db_mute,
  chat_db_unmute,
  chat_db_mute_get,
} = require("./chat_db");
let date = new Date();
let time_h = date.getHours();
let time_m = date.getMinutes();
let time = `${time_h}:${time_m}`;

let chatRoom = "";
let allUsers = [];
var mutedUsers = [];
let adminUsers = ["Lohith"];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}

async function updateMuteUsersList() {
  mutedUsers = [];
  mutedUsersList = await chat_db_mute_get();
  mutedUsersList.map((users) => {
    mutedUsers.push(users.username);
  });
  console.log(mutedUsers);
}
async function updateChatHistory() {}
function socket(socketIO) {
  socketIO.on(`connection`, (socket) => {
    console.log(`status: ${socket.id} user just connected!`);

    socket.on("join_room", async (data) => {
      const { username, room } = data;
      socket.join(room);
      socket.to(room).emit("user_joined", {
        username: username,
      });
      updateMuteUsersList();
      //console.log(mutedUsersList);

      const chats = await chat_db_get(room);
      //console.log(chats);
      socketIO.to(room).emit("chat_history", chats);
      chatRoom = room;
      allUsers.push({ id: socket.id, username, room });
      console.log(allUsers);
      chatRoomUsers = allUsers.filter((user) => user.room === room);

      //console.log(mutedUsers);
      socketIO.to(room).emit("room_users", chatRoomUsers);
      socket.emit("room_users", chatRoomUsers);
      socket.on("message", (data) => {
        console.log(
          data.username,
          data.message,
          data.id,
          data.socketID,
          data.time,
          data.room
        );
        if (!mutedUsers.includes(data.username)) {
          chat_db_save(data);
          socketIO.to(room).emit("messageRes", data);
        }
      });

      // [TODO] On disconnect
      socket.on("leave_room", (data) => {
        const { username, room } = data;
        socket.leave(room);
        // Remove user from memory

        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit("room_users", allUsers);
        socket.to(room).emit("user_left", {
          username: username,
        });

        console.log(`${username} has left the chat`);
      });
      socket.on("delete_msg", async (data) => {
        console.log(
          "message delete request",
          data.username,
          data.messageID,
          data.room
        );
        //socket.emit("delete_msg_res", messageID);

        if (
          adminUsers.includes(data.username) ||
          data.username === data.messageUser
        ) {
          await chat_db_delete(data.messageID, data.room);
          const chats = await chat_db_get(room);
          socketIO.to(room).emit("chat_history", chats);
          await socket.emit("delete_msg_res");
        } else {
          socket.emit("not_admin", data.username);
        }
      });
      socket.on("mute_user", async (data) => {
        console.log("mute user request", data.muteUsername);
        if (data.adminUsername === data.muteUsername) {
          socket.emit("self_mute");
          return;
        }
        if (adminUsers.includes(data.adminUsername)) {
          if (mutedUsers.includes(data.muteUsername)) {
            socket.emit("mute_exist", data.muteUsername);
            console.log("user already muted");
          } else {
            await chat_db_mute(data);
            await updateMuteUsersList();
            await socket.emit("mute_success", data.muteUsername);
          }
        } else {
          socket.emit("not_admin", data.adminUsername);
        }
      });
      socket.on("unmute_user", async (data) => {
        console.log("unmute user request", data.unmuteUsername);
        if (adminUsers.includes(data.adminUsername)) {
          if (mutedUsers.includes(data.unmuteUsername)) {
            await chat_db_unmute(data);
            await updateMuteUsersList();
            await socket.emit("unmute_success", data.unmuteUsername);
          } else {
            socket.emit("not_muted", data.unmuteUsername);
            console.log("user already unmuted");
          }
        } else {
          socket.emit("not_admin", data.adminUsername);
        }
      });
    });

    socket.on(`disconnect`, () => {
      console.log("disconnnected");
    });
  });
}
module.exports = socket;
