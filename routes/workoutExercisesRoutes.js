const express = require('express');
const router = express.Router();
const workoutExercisesController = require('../controllers/workoutExercisesController');

router
  .route('/')
  .get(workoutExercisesController.getAllWorkoutExercises)
  .post(workoutExercisesController.addWorkout)
  .patch(workoutExercisesController.updateMultipleExercises);

router
  .route('/:id')
  .get(workoutExercisesController.getWorkout)
  .patch(workoutExercisesController.updateWorkout)
  .delete(workoutExercisesController.deleteWorkout);

module.exports = router;
