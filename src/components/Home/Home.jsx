import NavbarHeader from "../Navbar/Navbar";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Home.css";
import articles from "./news.json";
import Discuss from "../Discuss/DiscussHome";
import { color } from "@mui/system";

import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import CallTwoToneIcon from "@mui/icons-material/CallTwoTone";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";

const home = {
  bg: {
    padding: "12vh 0",
  },
};
function Home(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newsData, setNewsData] = useState([]);
  const services = async () => {
    const NewsApi = await axios.get("/envapi");
    const response = await axios.get(NewsApi.data);
    setNewsData(articles.articles);
  };

  useEffect(() => {
    services();
  }, []);

  return (
    <div>
      <NavbarHeader handleShow={handleShow} username={props.username} />
      <Discuss
        show={show}
        username={props.username}
        room={props.room}
        setRoom={props.setRoom}
        socket={props.socket}
        handleClose={handleClose}
      />

      <div style={home.bg}>
        <Container className="home-deco">
          <div>
            <img src="home-reading-icon.svg" className="home-deco-icon" />
          </div>
          <div className="title-deco">
            <br />
            <br />
            <h1 className="heading">Stud Hub</h1>
            <hr style={{ backgroundColor: `black`, borderColor: `black` }} />
            <div>
              <h2 className="title">
                A Portal For <br /> Students
              </h2>
            </div>
            <h6 className="subtitle">
              "an opensourse project created for the students by the students"
              <br />
              <br />
              <h3>Chat Room, Study Materials and Tech News Articles</h3>
            </h6>
          </div>
        </Container>
      </div>
      <Container className="news-container">
        <Row md={2} xs="auto">
          {newsData.map((article, i) => (
            <Col sm={2} key={i}>
              <a
                style={{ color: `#5d5d5d`, textDecoration: `none` }}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card hoverable="true" className="news-cards">
                  <Card.Img variant="top" src={article.urlToImage} />
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.description}</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </Container>

      <div className="stud-footer">
        <Container>
          <Row>
            <Col sm>
              <div>
                <img src="stud-logo.svg" className="stud-logo-footer" />
                <h1 style={{ color: `#848991`, fontSize: `16px` }}>
                  Stud Hub is a college project
                </h1>
              </div>
            </Col>
            <Col sm>
              <h4>Features</h4>
              <div style={{ color: `#848991`, listStyle: `none` }}>
                <li>Chat </li>
                <li>Study Materials </li>
                <li>Tech News </li>
              </div>
            </Col>
            <Col sm>
              <h4>Contact</h4>
              <div
                style={{ fontSize: `px`, color: `#848991`, listStyle: `none` }}
              >
                <li>
                  <CallTwoToneIcon />
                  +91 7406485597{" "}
                </li>
                <li>
                  <EmailTwoToneIcon />
                  lohitgowda56@gmail.com
                </li>
                <li>
                  <LocationOnTwoToneIcon />
                  Bangalore, Karnataka, India{" "}
                </li>
              </div>
            </Col>
            <Col>
              <Nav>
                <svg
                  height="32"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="32"
                  data-view-component="true"
                  class="octicon octicon-mark-github v-align-middle"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </svg>
                <Nav.Link
                  style={{ color: `#000` }}
                  href="https://github.com/Thagoo/Stud-Hub"
                >
                  Source Code
                </Nav.Link>
              </Nav>
              <img src="footer-security.svg" style={{ height: `16vh` }} />
            </Col>
          </Row>
        </Container>

        <hr />
        <Container>
          <h1 style={{ color: `#848991`, fontSize: `14px` }}>
            Copyright 2023 © SLS Technologies. All rights reserved.
          </h1>
        </Container>
      </div>
    </div>
  );
}

export default Home;
