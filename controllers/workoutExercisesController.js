const factory = require('./factoryController');
const db = require('./databaseController');

exports.addWorkout = factory.addOne('workouts_exercises', false);
exports.deleteWorkout = factory.deleteById('workouts_exercises', false);
exports.getWorkout = factory.getById('workouts_exercises', 'workout_exercise_id');
exports.getAllWorkoutExercises = factory.getAll('workouts_exercises', false, [
  {
    targetTable: 'exercises',
    column: 'exercise_id',
    targetColumn: 'exercise_id',
  },
]);
exports.updateWorkout = factory.updateOne('workouts_exercises', false);
exports.updateMultipleExercises = async (req, res) => {
  const exercisesToUpdate = req.body;
  let query = 'UPDATE workouts_exercises SET exercise_order = CASE workout_exercise_id ';
  let endWhere = 'END WHERE workout_exercise_id IN(';

  exercisesToUpdate.forEach((exercise, i) => {
    // Parsing the keys will prevent SQL injection attacks
    let workout_exercise_id = parseInt(exercise.workout_exercise_id);
    let exercise_order = parseInt(exercise.exercise_order);

    query = `${query} WHEN ${workout_exercise_id} THEN ${exercise_order}`;
    endWhere = `${endWhere}${i !== 0 ? ',' : ''}${workout_exercise_id}`;
  });
  query = `${query} ELSE exercise_order ${endWhere}) RETURNING *`;

  let exercises = await db.raw(query);

  res.status(200).json({
    status: 'success',
    data: exercises.rows,
  });
};
