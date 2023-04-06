import React from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Nav,
  Navbar,
  OverlayTrigger,
  Tooltip,
  Offcanvas,
} from "react-bootstrap/";
import { LinkContainer } from "react-router-bootstrap";
import { useEffect } from "react";
import LogoutTwoToneIcon from "@mui/icons-material/Logout";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import QuestionAnswerTwoToneIcon from "@mui/icons-material/QuestionAnswerTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";

const NavbarHeader = (props) => {
  const user = props.username;

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {});
  return (
    <div>
      <Navbar
        expand="sm"
        bg="light"
        className="fixed-top mb-1 "
        style={{
          zIndex: `1040`,
          boxShadow: `0 2px 100px rgba(0,0,0,.25)`,
        }}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img className="logo-header-main" src="stud-logo.svg" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>
            <Navbar.Offcanvas placement="end">
              <Offcanvas.Header closeButton>
                <LinkContainer to="/">
                  <Offcanvas.Title>
                    <img className="logo-header-main" src="stud-logo.svg" />
                  </Offcanvas.Title>
                </LinkContainer>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto">
                  <LinkContainer to="/studymaterials">
                    <Nav.Link>
                      <MenuBookTwoToneIcon />
                      Study Materials
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={props.handleShow}>
                    <QuestionAnswerTwoToneIcon />
                    Chat
                  </Nav.Link>
                </Nav>
                <Nav>
                  <br />

                  <Nav.Link disabled>
                    <AccountCircleTwoToneIcon />
                    {user}
                  </Nav.Link>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Signed in as @{user}</Tooltip>}
                  >
                    <Nav.Link onClick={handleLogout}>
                      <LogoutTwoToneIcon />
                      Signout
                    </Nav.Link>
                  </OverlayTrigger>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarHeader;
