import React, { useState } from "react";
import ChatFooter from "./ChatFooter";
import "./Chat.css";
import { Alert, Modal } from "react-bootstrap";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  IconButton,
  Popover,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@material-ui/core/";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import CloseButton from "@mui/icons-material/Close";
import { useEffect } from "react";

const ChatBody = ({ username, messages, socket, room, lastMessageRef }) => {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const [showLoading, setShowLoading] = useState(false);

  const handleCloseLoading = () => {
    setShowLoading(false);
  };

  const [messageID, setMessageID] = useState("");
  const [messageUser, setMessageUser] = useState("");
  const [optionShow, setOptionShow] = useState(null);
  const handleOptionShow = (event, id, user) => {
    setMessageID(id);
    setMessageUser(user);
    setOptionShow(event.currentTarget);
  };

  const handleOptionClose = () => setOptionShow(null);
  const show = Boolean(optionShow);
  const msgOption = open ? "simple-popover" : undefined;

  const handleMute = () => {
    setShowLoading(true);
    socket.emit("mute_user", {
      adminUsername: username,
      muteUsername: messageUser,
      room: room,
    });
    handleOptionClose();
  };
  const handleUnmute = () => {
    setShowLoading(true);
    socket.emit("unmute_user", {
      adminUsername: username,
      unmuteUsername: messageUser,
      room: room,
    });
    handleOptionClose();
  };
  const handleDeleteMsg = () => {
    setShowLoading(true);
    socket.emit("delete_msg", {
      username: username,
      messageUser: messageUser,
      messageID: messageID,
      room: room,
    });
    handleOptionClose();
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
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("user_joined", (data) => {
      setGreeting(data.username + " has joined the chat");
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("not_admin", (user) => {
      setGreeting(`${user} is not admin to do this task`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("mute_success", (user) => {
      setGreeting(`${user} has been muted successfully`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("unmute_success", (user) => {
      setGreeting(`${user} has been unmuted successfully`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("not_muted", (user) => {
      setGreeting(`${user} is not muted`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("mute_exist", (user) => {
      setGreeting(`${user} has already been muted`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("self_mute", () => {
      setGreeting(`self mute is not allowed`);
      setOpen(true);
      setShowLoading(false);
    });
  });
  useEffect(() => {
    socket.on("delete_msg_res", () => {
      setShowLoading(false);
    });
  });
  return (
    <>
      <Grid item md={9}>
        <Modal
          show={showLoading}
          onHide={handleCloseLoading}
          backdrop="static"
          keyboard={false}
          className="loading-modal"
        >
          <center>
            <CircularProgress />
          </center>
        </Modal>
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
            <ListItem key={message.id}>
              <Popover
                id={msgOption}
                open={show}
                onClose={handleOptionClose}
                anchorEl={optionShow}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleDeleteMsg}>
                  <DeleteIcon style={{ marginRight: `6px` }} />
                  Delete
                </MenuItem>

                <Divider style={{ backgroundColor: "black" }} />
                <MenuItem onClick={handleMute}>
                  <RemoveCircleRoundedIcon style={{ marginRight: `6px` }} />
                  Mute User
                </MenuItem>
                <MenuItem onClick={handleUnmute}>
                  <RemoveCircleRoundedIcon style={{ marginRight: `6px` }} />
                  Unmute User
                </MenuItem>
              </Popover>
              <Grid container>
                <Grid
                  item
                  xs={11}
                  style={{ display: `flex`, flexDirection: `column` }}
                >
                  <div
                    key="1"
                    className="msg-bubble"
                    style={{
                      alignSelf: `${
                        message.username == username ? "flex-end" : "flex-start"
                      }`,
                    }}
                  >
                    {message.username == username ? null : (
                      <ListItem style={{ paddingLeft: 5 }}>
                        <Avatar
                          style={{ width: 22, height: 22, marginRight: 10 }}
                        ></Avatar>
                        <ListItemText secondary={message.username} />
                      </ListItem>
                    )}
                    <div
                      onClick={(event) =>
                        handleOptionShow(event, message.id, message.username)
                      }
                      style={{
                        padding: `6px 10px 6px 10px`,
                        cursor: `pointer`,
                        marginLeft: `${
                          message.username == username ? "0" : "5vh"
                        }`,
                        borderRadius: `15px`,
                        backgroundColor: `${
                          message.username == username ? "#3f51b5" : "#e0e0e0"
                        }`,
                        color: `${
                          message.username == username ? "white" : "#1d1d1d"
                        }`,
                        textAlign: `center`,
                      }}
                    >
                      <ListItemText primary={message.message} />
                    </div>
                    <ListItemText
                      secondary={message.time}
                      style={{ marginLeft: `5vh` }}
                    />
                  </div>
                </Grid>
                <Grid item xs={11}>
                  <ListItemText
                    align={message.username == username ? "right" : "left"}
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
