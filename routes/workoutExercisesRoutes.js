const express = require('express');
const router = express.Router();
const workoutExercisesController = require('../controllers/workoutExercisesController');

router.route('/').get(workoutExercisesController.getAllWorkoutExercises);

module.exports = router;
