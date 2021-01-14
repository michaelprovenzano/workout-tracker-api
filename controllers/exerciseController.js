const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

// Currently modifying exercises is reserved for admin privelages
exports.addExercise = factory.addOne('exercises');
exports.getExerciseById = factory.getById('exercises', 'exercise_id');
exports.getExercises = factory.getAll('exercises');
exports.updateExercise = factory.updateOne('exercises', 'exercise_id');
