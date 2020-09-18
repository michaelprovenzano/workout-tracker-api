const express = require('express');
const router = express.Router();
const programLogController = require('../controllers/programLogController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/program-log-stats/:programLogId').get(programLogController.getProgramStats);

module.exports = router;
