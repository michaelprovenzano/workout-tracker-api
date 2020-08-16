const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.route('/').post(workoutController.addWorkout).get(workoutController.getAllWorkouts);

router
  .route('/:id')
  .delete(workoutController.deleteWorkout)
  .patch(workoutController.updateWorkout)
  .get(workoutController.getWorkoutById);

module.exports = router;
