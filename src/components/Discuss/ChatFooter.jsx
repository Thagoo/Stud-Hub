import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Grid, TextField, Fab } from "@material-ui/core/";
import SendIcon from "@material-ui/icons/Send";

const ChatFooter = ({ username, socket, room }) => {
  const [message, setMessage] = useState("");
  const date = new Date();
  const Time = date.getHours() + ":" + date.getMinutes();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message && username) {
      socket.emit("message", {
        message: message,
        username: username,
        id: `${socket.id}${Math.random()}`,
        sodketID: socket.id,
        time: Time,
        room: room,
      });
    }
    setMessage("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  return (
    <>
      <Grid container className="chat-footer">
        <Grid item xs={11}>
          <TextField
            id="outlined-basic-email"
            label="Type Something"
            value={message}
            autoFocus={true}
            onBlur={({ target }) => target.focus()}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
            fullWidth
          />
        </Grid>
        <Grid xs={1} align="right">
          <Fab
            color="primary"
            aria-label="add"
            onClick={(e) => {
              handleSendMessage(e);
            }}
          >
            <SendIcon />
          </Fab>
        </Grid>
      </Grid>
    </>
  );
};

export default ChatFooter;
