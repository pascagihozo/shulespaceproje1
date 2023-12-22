const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const secret = 'your-secret-key'; // Replace with your actual secret key

const getRegister = (req, res) => {
  res.render('register')
}

const getLogin = (req, res) => {
  res.render('login')
}
// const getCurrentUser = (req, res) =>{
//   const token = req.headers['authorization']?.split(" ")[1]

//   // Verify token, decode it then fetch and send back the current user to the app


// }

const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    // Check if the token is not provided
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    // Verify the token and handle errors
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Unauthorized - Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Fetch the user based on the decoded user ID
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove sensitive information before sending the user object in the response
      const sanitizedUser = {
        _id: user._id,
        username: user.username,
        // Add other non-sensitive user properties as needed
      };

      res.json(sanitizedUser);
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get current user' });
  }
};

// User registration
const register = async (req, res) => {
  try {
    const userData = req.body;                                          // You should validate and sanitize the data here
    const user = new User(userData);
    user.save();
  
    res.status(201).json({ message: 'User registered successfully' });
    // res.render('login');
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, secret, { expiresIn: '1h' });

    // Save the token to local storage
    // localStorage.setItem('your-secret-key', token);
    console.log('Generated Token:', token);
    req.session.token = token;
    // Include the user's role in the response
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  register,
  login,
  getRegister,
  getLogin,
  getCurrentUser
};