const express = require("express");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { uploadToGoogleDrive } = require("./uploads/uploader");
const { authenticateGoogle } = require("./uploads/auth-google");
const fs = require("fs");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        //`${__dirname}/${req.body.course}/${req.body.sem}/${req.body.subject}/`
        `${__dirname}/uploads/`
      );
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config({ path: "./.env" });
const bcrypt = require("bcrypt");

MONGODB_URL = process.env.MONGODB_URL;
PORT = process.env.PORT;
NEWS_API_ID = process.env.NEWS_API_ID;
mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  uname: String,
  course: String,
  sem: String,
  passwd: String,
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", async (req, res) => {
  const { uname, passwd } = req.body;

  //check username
  const user = await User.findOne({ uname: uname });
  if (!user) {
    return res.status(400).send("user not found");
  }

  // verify password with encrypted password
  if (await bcrypt.compare(passwd, user.passwd)) {
    res.send(uname);
  } else {
    res.status(400).send("password is incorrect");
  }
});

app.post("/register", async (req, res) => {
  const { fname, lname, uname, course, sem, passwd } = req.body;

  // Ecrypt password using bcrypt
  const encryptedPassword = await bcrypt.hash(passwd, 10);

  //check username
  User.findOne({ uname: uname }, (err, user) => {
    if (user) {
      res.status(400).send("username_exist");
    } else {
      const user = new User({
        fname,
        lname,
        uname,
        course,
        sem,
        passwd: encryptedPassword,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ status: "Account has been created" });
        }
      });
    }
  });
});
app.post("/upload-to-google-drive", upload.single("file"), async (req, res) => {
  await console.log(req.file.originalname);
  const subject = req.body.subject;
  const auth = authenticateGoogle();
  const file = req.file;

  const response = await uploadToGoogleDrive(file, auth, subject);
  res.status(200).json({ response });

  fileSection = `${req.body.course}/${req.body.sem}/${req.body.subject}/`;
  const dir = `${__dirname}/uploads/study-materials/${fileSection}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file_path = dir + req.file.originalname;
  fs.rename(req.file.path, file_path, (err) => {
    if (err) throw err;
    console.log("File moved!");
  });
  console.log(req.body);
});
app.use(express.static(path.join(__dirname, "build")));

//app.get("/*", (req, res) => {
//  res.sendFile(path.join(__dirname, "build", "index.html"));
//});
app.get("/envapi", async (req, res) => {
  res.send(NEWS_API_ID);
});
const server = app.listen("8000", () => {
  console.log(`Server listening on 8000`);
});
const server2 = require("http").createServer(server);
const socketIO = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("./discuss/discuss")(socketIO);
