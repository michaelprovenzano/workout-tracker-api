const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/workoutLogController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router
  .route('/')
  .post(workoutLogController.addWorkoutLog)
  .get(workoutLogController.getAllWorkoutLogs);

router
  .route('/:id')
  .delete(workoutLogController.deleteWorkoutLog)
  .patch(workoutLogController.updateWorkoutLog)
  .get(workoutLogController.getWorkoutLogById);

module.exports = router;
