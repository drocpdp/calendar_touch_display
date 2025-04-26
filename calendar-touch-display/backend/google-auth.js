// backend/google-auth.js

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Paths to your OAuth client credentials and token files
const CRED_PATH  = path.join(__dirname, 'credentials', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'credentials', 'token.json');

// The scopes your app needs
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// ⚠️ Replace these two with your actual Calendar IDs from Google Calendar settings
const calendarIds = [
  'e504865c0a6f405c8e4ce1551e1e490a319c2314cfe9a3cd9194e05266adc84a@group.calendar.google.com',
  '800befe0801aff4cff4875bdac241b751ebc523f180b359baf4def5387756af8@group.calendar.google.com',
];

let oAuth2Client;

/**
 * Load client credentials, instantiate OAuth2 client,
 * load saved token, and set credentials.
 */
async function authorize() {
  // 1. Load client secrets
  if (!fs.existsSync(CRED_PATH)) {
    throw new Error(`Missing credentials.json at ${CRED_PATH}`);
  }
  const creds = JSON.parse(fs.readFileSync(CRED_PATH));

  // Support both "installed" and "web" credential JSON formats
  const { client_id, client_secret, redirect_uris } = creds.installed || creds.web;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // 2. Load previously saved token
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error(`Missing token.json at ${TOKEN_PATH}. Run getToken.js first.`);
  }
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
}

/**
 * Fetch the next upcoming event from each calendar.
 * Returns an array of two objects: [{ summary, start }, { summary, start }]
 */
async function getNextEvents() {
  await authorize();

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const nowIso = (new Date()).toISOString();

  // Fetch one upcoming event per calendar
  const results = await Promise.all(
    calendarIds.map(async calId => {
      const res = await calendar.events.list({
        calendarId:    calId,
        timeMin:       nowIso,
        maxResults:    1,
        singleEvents:  true,
        orderBy:       'startTime'
      });
      const items = res.data.items;
      if (!items || items.length === 0) {
        return { summary: 'No upcoming events', start: null };
      }
      const ev = items[0];
      return {
        summary: ev.summary,
        start:   ev.start.dateTime || ev.start.date
      };
    })
  );

  return results;
}

/**
 * Build the embed URL for a given calendar and view mode.
 * view can be 'daily' or 'weekly'
 */
function getCalendarEmbed(calId, view = 'weekly') {
    let mode;
    if (view === 'daily')      mode = 'AGENDA';
    else /* view==='weekly' */  mode = 'WEEK';
    return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calId)}&mode=${mode}`;
  }
  

module.exports = {
  getNextEvents,
  getCalendarEmbed
};

