const folderID = (subject) => {
  if (subject === "ca") {
    return "19h-bsv120mbc2S1XiMKR4XRPeeKgKK7c";
  } else if (subject === "mp") {
    return "1yevP4yVhaUZxeHyFzwNC5okHtIPwaeNj";
  } else if (subject === "java") {
    return "15lH11tug3YV3I3o5AN4gt-kiHSdDOODN";
  } else if (subject === "se") {
    return "1TmCA-DGZUUhzteUthVhZAyimvp63HS1o";
  } else if (subject === "dcn") {
    return "1dTSVSDJmiwHRi7n0M57l-KMsco3boLDZ";
  } else {
    return "Subject not supported";
  }
};
module.exports = { folderID };
