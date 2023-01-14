const fs = require("fs");
const { google } = require("googleapis");
const { folderID } = require("./folderID");

function uploadToGoogleDrive(file, auth, subject, socket) {
  const drive = google.drive({ version: "v3" });

  const parentID = folderID(subject);
  console.log(subject, parentID);
  console.log("test", file.originalname);
  const fileMetadata = {
    name: file.originalname,
    parents: [parentID],
  };

  const response = drive.files.create(
    {
      auth: auth,
      resource: fileMetadata,
      media: {
        mimeType: file.mimeType,
        body: fs.createReadStream(file.path),
      },
      fields: "id",
    },
    {
      onUploadProgress: (evt) => {
        console.log("test2", file.size);
        const progress = Math.round((evt.bytesRead / file.size) * 100);
        console.log("test", progress);
        socket.emit("progress", progress);
      },
    },
    (err, res) => {
      if (err) {
        return err;
      }
    }
  );
  return response;
}
module.exports = { uploadToGoogleDrive };
