const factory = require('./factoryController');

exports.addWorkout = factory.addOne('programs_workouts');
exports.deleteWorkout = factory.deleteById('programs_workouts');
exports.getAllProgramWorkouts = factory.getAll('programs_workouts', false, [
  {
    targetTable: 'workouts',
    column: 'workout_id',
    targetColumn: 'workout_id',
  },
]);
exports.updateWorkout = factory.updateOne('programs_workouts');
