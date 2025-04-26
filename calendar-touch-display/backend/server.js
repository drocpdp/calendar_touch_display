const express = require('express');
const path = require('path');
const { getNextEvents, getCalendarEmbed } = require('./google-auth');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/api/next', async (req, res) => {
    // getNextEvents() resolves to [ { summary, start }, { summary, start } ]
    const [event1, event2] = await getNextEvents();
    res.json({
      next1: { summary: event1.summary, start: event1.start },
      next2: { summary: event2.summary, start: event2.start }
    });
  });

app.get('/api/calendar', (req, res) => {
  const { cal, view } = req.query;
  res.redirect(getCalendarEmbed(cal, view));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
