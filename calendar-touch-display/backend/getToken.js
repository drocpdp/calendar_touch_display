const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { google } = require('googleapis');

const CRED_PATH = path.join(__dirname, 'credentials/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'credentials/token.json');

// Load client secrets from a local file.
const creds = JSON.parse(fs.readFileSync(CRED_PATH));
const oAuth2Client = new google.auth.OAuth2(
  creds.installed.client_id,
  creds.installed.client_secret,
  creds.installed.redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar']
});

console.log('1) Go to this URL in your browser:\n', authUrl);
console.log('2) After you approve the app, you’ll be redirected to a URL like:');
console.log('   http://localhost/?code=4/XYZ…');
console.log('3) Copy the “code=…” part and paste it below.\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code.trim(), (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    // Save the token for later program executions
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
});
