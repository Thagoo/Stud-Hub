const fs = require("fs");
const { google } = require("googleapis");
const { folderID } = require("./folderID");

const uploadToGoogleDrive = async (file, auth, subject) => {
  const drive = google.drive({ version: "v3" });

  const parentID = folderID(subject);
  console.log(subject, parentID);
  console.log("test", file.originalname);
  const fileMetadata = {
    name: file.originalname,
    parents: [parentID],
  };

  const response = await drive.files.create({
    auth: auth,
    resource: fileMetadata,
    media: {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.path),
    },
    fields: "id",
  });
  return response;
};
module.exports = { uploadToGoogleDrive };
