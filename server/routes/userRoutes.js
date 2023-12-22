const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController'); // Import your user controller

// Define routes for user-related operations
userRoutes.get('/register', userController.getRegister);
userRoutes.post('/register', userController.register); // User registration
userRoutes.get('/login', userController.getLogin);
userRoutes.post('/login', userController.login); // User loginrouter.post('/api/signup', userController.register); // User registration
userRoutes.get('/me', userController.getCurrentUser)


// Define other user-related routes as needed

module.exports = {userRoutes};
