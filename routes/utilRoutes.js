const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/workoutLogController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/complete-active-workout').patch(workoutLogController.completeActiveWorkout);

module.exports = router;
