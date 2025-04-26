const express = require('express');
const path = require('path');
const { getNextEvents, getCalendarEmbed } = require('./google-auth');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/api/next', async (req, res) => {
  const [n1, n2] = await getNextEvents();
  res.json({ next1: n1.summary, next2: n2.summary });
});

app.get('/api/calendar', (req, res) => {
  const { cal, view } = req.query;
  res.redirect(getCalendarEmbed(cal, view));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
