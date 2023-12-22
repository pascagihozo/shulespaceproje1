const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mustacheExpress = require('mustache-express');
const dotenv = require('dotenv');
const path = require('path');

// Import your authentication middleware
const { requestLogger, errorHandler, authenticateUser, authorizeAlumni, authorizeAlumniManager } = require('./middleware');
const {userRoutes} = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://pascagihozo:YXhausk0djcvY0G5@shulespace.phmvjjp.mongodb.net/shulespace?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up Mustache as the template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/users', userRoutes);
// // Use authentication middleware
// app.use(requestLogger);
// app.use(authenticateUser);
// app.use(authorizeAlumni);
// app.use(authorizeAlumniManager);

// Routes

app.use('/api/events',  eventRoutes);

// Serve static files (e.g., CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Define a default route to render a Mustache file
app.get('/', (req, res) => {
  res.render('index.mustache', { title: "Test"});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
