const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Database connection (assuming you have MongoDB installed)
mongoose.connect('mongodb+srv://pascagihozo:YXhausk0djcvY0G5@shulespace.phmvjjp.mongodb.net/shulespace?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Update User model to include the role field
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['Alumni Student', 'Alumni Manager'],
    default: 'Alumni Student',
  },
});

app.use(bodyParser.json());

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;                                                  // Extract the role from the request body
    if (!username || !email || !password || !role) {                                                      // Check if role is provided
      return res.status(400).json({ error: 'Please provide all required fields, including the role.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role }); // Include the role in the user creation
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
