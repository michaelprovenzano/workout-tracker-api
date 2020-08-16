const express = require('express');
const router = express.Router();
const exerciseLogController = require('../controllers/exerciseLogController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').post(exerciseLogController.addLog).get(exerciseLogController.getAllLogs);

router
  .route('/:id')
  .get(exerciseLogController.getLogById)
  .patch(exerciseLogController.updateLog)
  .delete(exerciseLogController.deleteLog);

module.exports = router;
