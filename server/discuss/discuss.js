const {
  chat_db_save,
  chat_db_get,
  chat_db_delete,
  chat_db_mute,
  chat_db_mute_get,
} = require("./chat_db");
let date = new Date();
let time_h = date.getHours();
let time_m = date.getMinutes();
let time = `${time_h}:${time_m}`;

let chatRoom = "";
let allUsers = [];
let mutedUsers = [];
let adminUsers = [];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}
function socket(socketIO) {
  socketIO.on(`connection`, (socket) => {
    console.log(`status: ${socket.id} user just connected!`);

    socket.on("join_room", async (data) => {
      const { username, room } = data;
      socket.join(room);
      socket.to(room).emit("user_joined", {
        username: username,
      });
      const mutedUsersList = await chat_db_mute_get();
      mutedUsersList.map((users) => {
        mutedUsers.push(users.username);
      });
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
        console.log("message delete request", data.messageID);
        //socket.emit("delete_msg_res", messageID);

        if (
          adminUsers.includes(data.username) ||
          data.username === data.messageUser
        ) {
          await chat_db_delete(data.messageID);
          const chats = await chat_db_get();
          socket.emit("delete_msg_res", chats);
        } else {
          socket.emit("not_admin", data.username);
        }
      });
      socket.on("mute_user", async (data) => {
        console.log("mute user request", data.muteUsername);
        if (adminUsers.includes(data.adminUsername)) {
          if (mutedUsers.includes(data.muteUsername)) {
            socket.emit("mute_exist", data.muteUsername);
            console.log("user already muted");
          } else {
            chat_db_mute(data);
            mutedUsers.push(data.muteUsername);
            socket.emit("mute_success", data.muteUsername);
            console.log(mutedUsers);
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
