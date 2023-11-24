const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];

async function getAuth() {
  const keyfilePath = path.join(__dirname, "../../credentials.json");
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  return authenticate({
    keyfilePath,
    clientId,
    clientSecret,
    redirectUri,
    scopes: SCOPES,
  });
}

module.exports = { getAuth };
