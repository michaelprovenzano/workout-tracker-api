const factory = require('./factoryController');

exports.addWorkout = factory.addOne('workouts');
exports.deleteWorkout = factory.deleteById('workouts', 'workout_id');
exports.getWorkoutById = factory.getById('workouts', 'workout_id');
exports.getAllWorkouts = factory.getAll('workouts');
exports.updateWorkout = factory.updateOne('workouts', 'workout_id');
