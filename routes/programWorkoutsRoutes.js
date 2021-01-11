const express = require('express');
const router = express.Router();
const programWorkoutsController = require('../controllers/programWorkoutsController');

router
  .route('/')
  .get(programWorkoutsController.getAllProgramWorkouts)
  .post(programWorkoutsController.addWorkout)
  .patch(programWorkoutsController.updateMultipleWorkouts);

router.route('/:id').delete(programWorkoutsController.deleteWorkout);

module.exports = router;
