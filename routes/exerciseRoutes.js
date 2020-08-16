const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.route('/').post(exerciseController.addExercise).get(exerciseController.getExercises);

router
  .route('/:id')
  .get(exerciseController.getExerciseById)
  .patch(exerciseController.updateExercise);

module.exports = router;
