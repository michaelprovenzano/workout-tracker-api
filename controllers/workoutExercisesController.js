const db = require('./databaseController');
const factory = require('./factoryController');

// exports.addWorkout = factory.addOne('workouts');
// exports.deleteWorkout = factory.deleteById('workouts');
exports.getAllWorkoutExercises = factory.getAll('workouts_exercises', false, [
  {
    targetTable: 'exercises',
    column: 'exercise_id',
    targetColumn: 'exercise_id',
  },
]);
// exports.updateWorkout = factory.updateOne('workouts');
