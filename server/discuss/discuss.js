let date = new Date();
let time_h = date.getHours();
let time_m = date.getMinutes();
let time = `${time_h}:${time_m}`;

let chatRoom = "";
let allUsers = [];
let mutedUsers = [];
function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}
function socket(socketIO) {
  socketIO.on(`connection`, (socket) => {
    console.log(`status: ${socket.id} user just connected!`);

    socket.on("join_room", (data) => {
      const { username, room } = data;
      socket.to(room).emit("user_joined", {
        username: username,
      });
      socket.join(room);

      chatRoom = room;
      allUsers.push({ id: socket.id, username, room });
      console.log(allUsers);
      chatRoomUsers = allUsers.filter((user) => user.room === room);

      //console.log(mutedUsers);
      socketIO.to(room).emit("room_users", chatRoomUsers);
      socket.emit("room_users", chatRoomUsers);
      socket.on("message", (data) => {
        console.log(data.username, data.message);
        socketIO.in(room).emit("messageRes", data);
      });
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
    });
  });
}
module.exports = socket;
