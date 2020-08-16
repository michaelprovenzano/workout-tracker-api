require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const exerciseLogRoutes = require('./routes/exerciseLogRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const programRoutes = require('./routes/programRoutes');
const programLogRoutes = require('./routes/programLogRoutes');
const authController = require('./controllers/authController');
const passport = require('./controllers/passportController');
const errorController = require('./controllers/errorController');

// Allow cors
app.use(cors());

// Parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read cookies
app.use(cookieParser());

// Use the configured version of passport
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/api/', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/program-logs', programLogRoutes);
app.get('/protected', authController.protect, (req, res) => {
  res.send('protected');
});

app.use(errorController);

// app.options('http://localhost:3000', cors());

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
