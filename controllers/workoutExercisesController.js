const factory = require('./factoryController');

exports.addWorkout = factory.addOne('workouts_exercises', false);
exports.deleteWorkout = factory.deleteById('workouts_exercises', false);
exports.getAllWorkoutExercises = factory.getAll('workouts_exercises', false, [
  {
    targetTable: 'exercises',
    column: 'exercise_id',
    targetColumn: 'exercise_id',
  },
]);
exports.updateWorkout = factory.updateOne('workouts_exercises', false);
