import React, { useState } from "react";
import ChatFooter from "./ChatFooter";
import "./Chat.css";
import { Alert } from "react-bootstrap";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  IconButton,
} from "@material-ui/core/";
import CloseButton from "@mui/icons-material/Close";
import { useEffect } from "react";

const ChatBody = ({ username, messages, socket, room, lastMessageRef }) => {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const closeSnackBar = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseButton fontSize="small" />
    </IconButton>
  );

  useEffect(() => {
    socket.on("user_left", (data) => {
      setGreeting(data.username + " has left the chat");
      setOpen(true);
    });
  });
  useEffect(() => {
    socket.on("user_joined", (data) => {
      setGreeting(data.username + " has joined the chat");
      setOpen(true);
    });
  });
  return (
    <>
      <Grid item md={9}>
        <List className="message-area">
          <Snackbar
            anchorOrigin={{ vertical: "center", horizontal: "center" }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={greeting}
            action={closeSnackBar}
          />
          <Alert variant="dark">
            <Alert.Heading>
              Hey, nice to see you {username}, Welcome to Stud Chat.
            </Alert.Heading>
            <p>
              Stud Chat is one of the core function of Stud App to facilitate
              communication and collaboration among students.
            </p>
            <hr />
            <p className="mb-0">
              How about a discussion on A.I or a popular person like Elon Musk?
            </p>
          </Alert>
          {messages.map((message) => (
            <ListItem key="1">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    secondary={
                      message.username == username ? "You" : message.username
                    }
                    align={message.username == username ? "right" : "left"}
                  ></ListItemText>
                  <ListItemText
                    align={message.username == username ? "right" : "left"}
                    primary={message.message}
                  ></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    align={message.username == username ? "right" : "left"}
                    secondary={message.time}
                  ></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <div ref={lastMessageRef}></div>
        </List>
        <Divider variant="middle" />
        <Divider />
        <ChatFooter username={username} socket={socket} room={room} />
      </Grid>
    </>
  );
};

export default ChatBody;
