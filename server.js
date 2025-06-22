// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema and model
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String
});
const Event = mongoose.model('Event', eventSchema);

// POST route - save event
app.post('/api/events', async (req, res) => {
  const { name, date, location } = req.body;

  if (!name || !date || !location) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newEvent = new Event({ name, date, location });
    await newEvent.save();
    console.log("✅ Saved:", newEvent);
    res.status(201).json({ message: 'Event saved', event: newEvent });
  } catch (err) {
    console.error("❌ Save error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// GET route - fetch all events
app.get('/api/events', (req, res) => {
  Event.find()
    .then((allEvents) => res.json(allEvents))
    .catch((err) => {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: 'Database fetch failed' });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
