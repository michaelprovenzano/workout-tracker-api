const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

router.route('/').post(programController.addProgram).get(programController.getAllPrograms);

router.route('/:id').get(programController.getProgramById).patch(programController.updateProgram);

module.exports = router;
