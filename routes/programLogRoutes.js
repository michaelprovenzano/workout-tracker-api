const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const programLogController = require('../controllers/programLogController');

router.use(authController.protect);

router
  .route('/')
  .post(programLogController.addProgramLog)
  .get(programLogController.getAllProgramLogs);

router.route('/postpone-next-workout').patch(programLogController.postponeNextWorkout);

router
  .route('/:id')
  .get(programLogController.getProgramLogById)
  .patch(programLogController.updateProgramLog);

module.exports = router;
