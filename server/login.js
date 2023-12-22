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

const User = mongoose.model('User', {
    email: String,
    password: String,
    role: String,
});

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const { role } = user;

        // Set session user information
        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        // Perform different actions based on the user's role
        switch (role) {
            case 'admin':
                // Handle admin actions
                return res.status(200).json({ message: 'Admin login successful.' });
            case 'student':
                // Handle student actions
                return res.status(200).json({ message: 'Student login successful.' });
            default:
                return res.status(200).json({ message: 'Login successful.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
