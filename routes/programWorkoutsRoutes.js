const express = require('express');
const router = express.Router();
const programWorkoutsController = require('../controllers/programWorkoutsController');

router
  .route('/')
  .get(programWorkoutsController.getAllProgramWorkouts)
  .patch(programWorkoutsController.updateMultipleWorkouts);

module.exports = router;
