import { useNavigate } from "react-router-dom";
import { Modal, Container, Form, Button } from "react-bootstrap";
import "./DiscussHome.css";
import { useState } from "react";

const Discuss = (props) => {
  const navigate = useNavigate();
  let [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const username = props.username;
  const room = props.room;

  const joinRoom = (e) => {
    e.preventDefault();
    props.socket.emit("join_room", { username, room });

    if (room !== "" && username !== "") {
      navigate("/chat", { replace: true });
    }
  };

  return (
    <>
      <Container>
        <Modal
          animation={true}
          show={props.show}
          onHide={props.handleClose}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>JOIN ROOM</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={joinRoom}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={props.username} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Select
                  className="select"
                  onChange={({ target }) => props.setRoom(target.value)}
                >
                  <option value="">Select Room</option>
                  <option value="bca">BCA</option>
                  <option value="bcom">BCom</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" style={{ width: `100%` }}>
                Join Room
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Discuss;
