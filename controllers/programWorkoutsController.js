const factory = require('./factoryController');
const db = require('./databaseController');

exports.addWorkout = factory.addOne('programs_workouts');
exports.deleteWorkout = factory.deleteById('programs_workouts', 'program_workout_id');
exports.getAllProgramWorkouts = factory.getAll('programs_workouts', false, [
  {
    targetTable: 'workouts',
    column: 'workout_id',
    targetColumn: 'workout_id',
  },
]);
exports.updateWorkout = factory.updateOne('programs_workouts');
exports.updateMultipleWorkouts = async (req, res) => {
  // console.log('getting multiple workouts');
  const workoutsToUpdate = req.body;
  let query = 'UPDATE programs_workouts SET workout_order = CASE program_workout_id ';
  let endWhere = 'END WHERE program_workout_id IN(';

  workoutsToUpdate.forEach((workout, i) => {
    // Parsing the keys will prevent SQL injection attacks
    let program_workout_id = parseInt(workout.program_workout_id);
    let workout_order = parseInt(workout.workout_order);

    query = `${query} WHEN ${program_workout_id} THEN ${workout_order}`;
    endWhere = `${endWhere}${i !== 0 ? ',' : ''}${program_workout_id}`;
  });
  query = `${query} ELSE workout_order ${endWhere}) RETURNING *`;

  let workouts = await db.raw(query);

  res.status(200).json({
    status: 'success',
    data: workouts.rows,
  });
};
