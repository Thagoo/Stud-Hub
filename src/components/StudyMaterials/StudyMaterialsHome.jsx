import React from "react";
import NavbarHeader from "../Navbar/Navbar";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Container, Tabs, Modal, Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useState } from "react";
import Discuss from "../Discuss/DiscussHome";
import GoogleDriveUploader from "./Uploader";

function StudyMaterials(props) {
  // Chat Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // File Uploader Modal
  const [showUploader, setShowUploader] = useState(false);
  const handleCloseUploader = () => setShowUploader(false);
  const handleShowUploader = () => setShowUploader(true);
  const UploaderModal = () => {
    return (
      <Modal
        animation={true}
        show={showUploader}
        onHide={handleCloseUploader}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Study Materials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleDriveUploader />
        </Modal.Body>
      </Modal>
    );
  };
  return (
    <>
      <NavbarHeader handleShow={handleShow} username={props.username} />
      <Discuss
        show={show}
        username={props.username}
        room={props.room}
        setRoom={props.setRoom}
        socket={props.socket}
        handleClose={handleClose}
      />
      <Container>
        <h1 style={{ textAlign: `center` }}>
          Study Materials <br />
          <br />
        </h1>
        <Tab.Container id="left-tabs-example" defaultActiveKey="bca">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="bca">B.C.A</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="bcom">B.Com</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ba">B.A</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="bca">
                  <Tabs
                    defaultActiveKey="5"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="1" title="1st Semester"></Tab>
                    <Tab eventKey="2" title="2nd Semester"></Tab>
                    <Tab eventKey="3" title="3rd Semester"></Tab>
                    <Tab eventKey="4" title="4th Semester"></Tab>
                    <Tab eventKey="5" title="5th Semester">
                      <h1 style={{ fontSize: `25px`, textAlign: `center` }}>
                        Study Materials
                      </h1>
                      <ListGroup>
                        <ListGroup.Item
                          action
                          href="https://stud-hub.lohitgowda56.workers.dev/0:/BCA/5TH%20SEMESTER/Computer%20Archtecture/"
                        >
                          Computer Archtecture
                        </ListGroup.Item>
                        <ListGroup.Item
                          action
                          href="https://stud-hub.lohitgowda56.workers.dev/0:/BCA/5TH%20SEMESTER/Data-Communication%20and%20Networks/"
                        >
                          Data-Communication and Networks
                        </ListGroup.Item>
                        <ListGroup.Item
                          action
                          href="https://stud-hub.lohitgowda56.workers.dev/0:/BCA/5TH%20SEMESTER/Java%20Programming/"
                        >
                          Java Programming
                        </ListGroup.Item>
                        <ListGroup.Item
                          action
                          href="https://stud-hub.lohitgowda56.workers.dev/0:/BCA/5TH%20SEMESTER/Microprocessor%20and%20Assembly%20language/"
                        >
                          Microprocessor and Assembly language
                        </ListGroup.Item>
                        <ListGroup.Item
                          action
                          href="https://stud-hub.lohitgowda56.workers.dev/0:/BCA/5TH%20SEMESTER/Software%20Engineering/"
                        >
                          Software Engineering
                        </ListGroup.Item>
                      </ListGroup>
                    </Tab>
                    <Tab eventKey="6" title="6th Semester"></Tab>
                  </Tabs>
                </Tab.Pane>
                <Tab.Pane eventKey="bcom">
                  <Tabs
                    defaultActiveKey="1"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="1" title="1st Semester"></Tab>
                    <Tab eventKey="2" title="2nd Semester"></Tab>
                    <Tab eventKey="3" title="3rd Semester"></Tab>
                    <Tab eventKey="4" title="4th Semester"></Tab>
                    <Tab eventKey="5" title="5th Semester"></Tab>
                    <Tab eventKey="6" title="6th Semester"></Tab>
                  </Tabs>
                </Tab.Pane>
                <Tab.Pane eventKey="ba">
                  <Tabs
                    defaultActiveKey="1"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="1" title="1st Semester"></Tab>
                    <Tab eventKey="2" title="2nd Semester"></Tab>
                    <Tab eventKey="3" title="3rd Semester"></Tab>
                    <Tab eventKey="4" title="4th Semester"></Tab>
                    <Tab eventKey="5" title="5th Semester"></Tab>
                    <Tab eventKey="6" title="6th Semester"></Tab>
                  </Tabs>
                </Tab.Pane>
                <Button
                  onClick={handleShowUploader}
                  style={{
                    width: `100%`,
                    marginTop: `8vh`,
                  }}
                >
                  Upload Study Materials
                </Button>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <UploaderModal />
      </Container>
    </>
  );
}
export default StudyMaterials;
