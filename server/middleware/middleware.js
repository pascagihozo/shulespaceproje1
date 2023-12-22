const jwt = require('jsonwebtoken');

// Request Logger Middleware
const requestLogger = (req, res, next) => {
  console.log(`Received a ${req.method} request at ${req.url}`);
  next();
};

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization');

  // Check if the token is not provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  // Verify the token and handle errors
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized - Token expired' });
      }
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  });
};

// Authorization Middleware for Alumni Students
const authorizeAlumni = (req, res, next) => {
  if (req.user && req.user.role === 'Alumni Student') {
    return next();
  }

  res.status(403).json({ error: 'Forbidden - Access denied for this user' });
};

// Authorization Middleware for Alumni Manager
const authorizeAlumniManager = (req, res, next) => {
  if (req.user && req.user.role === 'Alumni Manager') {
    return next();
  }

  res.status(403).json({ error: 'Forbidden - Access denied for this user' });
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Something broke!' });
};

module.exports = {
  requestLogger,
  authenticateUser,
  authorizeAlumni,
  authorizeAlumniManager,
  errorHandler,
};