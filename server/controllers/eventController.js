const Event = require('../models/Event'); // Assuming you have an Event model

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ error: 'Failed to fetch the event' });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    // Access user information from req.user
    const eventData = req.body; // You should validate and sanitize the data here

    const event = new Event(eventData);
    console.log(event);
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Event creation failed' });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    // Check if the user has the necessary role to delete events
    // if (req.user.role === 'Alumni Student' && (!event || event.createdBy.toString() !== req.user._id.toString())) {
    //   return res.status(403).json({ error: 'Permission denied.' });
    // }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Event.findByIdAndRemove(eventId);
    res.json(event);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete the event' });
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;

    // Check if the user has the necessary role to update events
    // if (req.user.role !== 'Alumni Student') {
    //   return res.status(403).json({ error: 'Permission denied.' });
    // }

    const event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update the event' });
  }
};
const myEvent = async (req, res) => {
  try {
    const {user} = req.body;
    const userId = user._id;
    // const userId = req.user._id; // Assuming you have the user ID in the request object
    const events = await Event.find({ createdBy: userId });

    res.json(events);
  } catch (error) {
    console.error('Error fetching user-specific events:', error);
    res.status(500).json({ error: 'Failed to fetch user-specific events' });
  }
};
module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  myEvent
};
