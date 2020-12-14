require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const exerciseLogRoutes = require('./routes/exerciseLogRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const workoutExercisesRoutes = require('./routes/workoutExercisesRoutes');
const programRoutes = require('./routes/programRoutes');
const programLogRoutes = require('./routes/programLogRoutes');
const programWorkoutsRoutes = require('./routes/programWorkoutsRoutes');
const utilRoutes = require('./routes/utilRoutes');

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

app.use('/api/', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/program-logs', programLogRoutes);
app.use('/api/program-workouts', programWorkoutsRoutes);
app.use('/api/workout-exercises', workoutExercisesRoutes);
app.use('/api/util', utilRoutes);
app.get('/protected', authController.protect, (req, res) => {
  res.send('protected');
});

app.use(errorController);

if (process.env.NODE_ENV === 'production') {
  app.use(static('client/build'));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 8000;
console.log(process.env.DATABASE_URL);
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
