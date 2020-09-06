const db = require('./databaseController');
const factory = require('./factoryController');

// exports.addWorkout = factory.addOne('workouts');
// exports.deleteWorkout = factory.deleteById('workouts');
exports.getAllProgramWorkouts = factory.getAll('programs_workouts', false, [
  {
    targetTable: 'workouts',
    column: 'workout_id',
    targetColumn: 'workout_id',
  },
]);
// exports.updateWorkout = factory.updateOne('workouts');
