const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mustacheExpress = require('mustache-express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Import your authentication middleware
const { requestLogger, errorHandler, authenticateUser, authorizeAlumni, authorizeAlumniManager } = require('./middleware');
const {userRoutes} = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes');
const { use } = require('chai');
const User = require('./models/Users');

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

app.use(
  session({
    secret: 'your-secret-key', // Replace with your actual secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Set up Mustache as the template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));


// Use authentication middleware
app.use(requestLogger);

// app.use(authenticateUser);
// app.use(authorizeAlumni);
// app.use(authorizeAlumniManager);



// Routes

app.use('/api/events',  eventRoutes);
app.use('/api/users', userRoutes);

// Serve static files (e.g., CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use("/api/event", eventRoutes);

// Define a default route to render a Mustache file
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/events/', (req, res) => {
  res.render('events');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/event', (req, res) => {
  res.render('event');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/404/', (req, res) => {
  res.render('404');
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
