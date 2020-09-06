const express = require('express');
const router = express.Router();
const programWorkoutsController = require('../controllers/programWorkoutsController');

router.route('/').get(programWorkoutsController.getAllProgramWorkouts);

module.exports = router;
