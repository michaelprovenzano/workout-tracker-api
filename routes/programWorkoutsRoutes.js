const express = require('express');
const router = express.Router();
const programWorkoutsController = require('../controllers/programWorkoutsController');

router
  .route('/')
  .get(programWorkoutsController.getAllProgramWorkouts)
  .post(programWorkoutsController.addWorkout)
  .patch(programWorkoutsController.updateMultipleWorkouts)
  .delete(programWorkoutsController.deleteWorkout);

module.exports = router;
