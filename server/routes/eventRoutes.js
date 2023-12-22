const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController'); // Import your event controller
const { authenticateUser } = require('../middleware'); // Import the authentication middleware

// Define routes for events
router.get('/', eventController.getEvents); // Get all events
router.get('/:id', eventController.getEventById); // Get a single event by ID

// Create a new event (only accessible to Alumni Students)
router.post('/', eventController.createEvent);

// Update an event by ID (only accessible to Alumni Students)
router.put('/:id', eventController.updateEvent);

// Delete an event by ID (only accessible to Alumni Students)
router.delete('/:id', eventController.deleteEvent);

router.post('/myevent', eventController.myEvent);

module.exports = router;