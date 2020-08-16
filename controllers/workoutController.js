const db = require('./databaseController');
const factory = require('./factoryController');

exports.addWorkout = factory.addOne('workouts');
exports.deleteWorkout = factory.deleteById('workouts');
exports.getWorkoutById = factory.getById('workouts');
exports.getAllWorkouts = factory.getAll('workouts');
exports.updateWorkout = factory.updateOne('workouts');
