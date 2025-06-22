const mongoose = require('mongoose');

// Import required modules
const express = require('express');
const path = require('path');

// Replace with your actual MongoDB connection string
mongoose.connect('mongodb+srv://oo:881206@cluster0.ya3ymba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define a schema (like a database blueprint)
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String
});

// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema);

// Create an Express app
const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Allow server to read JSON data

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Store events in memory (in this array)
let events = [];

// Handle POST requests to /api/events
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


// GET all events
app.get('/api/events', (req, res) => {
  Event.find()
  .then((allEvents) => res.json(allEvents))
  .catch((err) => {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: 'Database fetch failed' });
  });

});
