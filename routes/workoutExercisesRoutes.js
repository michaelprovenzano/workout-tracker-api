const express = require('express');
const router = express.Router();
const workoutExercisesController = require('../controllers/workoutExercisesController');

router
  .route('/')
  .get(workoutExercisesController.getAllWorkoutExercises)
  .patch(workoutExercisesController.updateMultipleExercises);

router
  .route('/:id')
  .post(workoutExercisesController.addWorkout)
  .patch(workoutExercisesController.updateWorkout)
  .delete(workoutExercisesController.deleteWorkout);

module.exports = router;
