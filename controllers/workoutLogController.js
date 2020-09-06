const db = require('./databaseController');
const factory = require('./factoryController');

exports.addWorkoutLog = async (req, res) => {
  req.body.user_id = req.user.id;
  req.body.active = true;
  req.body.created_at = new Date(Date.now());

  // Get the active program log
  let activeProgramLog = await db('program_logs')
    .where({ user_id: req.user.id, status: 'active' })
    .first();

  // Assign the index
  if (!req.body.workout_index) {
    activeProgramLog
      ? (req.body.workout_index = activeProgramLog.next_workout_index)
      : (req.body.workout_index = 0);
  }

  req.body.program_log_id = activeProgramLog.program_log_id;
  const workoutLog = await db.returning('*').insert(req.body).into('workout_logs');
  setWorkoutActive(workoutLog[0].workout_log_id, req.user.id, req.body.workout_index);
  res.status(200).json(workoutLog[0]);
};

exports.deleteWorkoutLog = async (req, res) => {
  const { id } = req.params;

  // Delete the exercise logs
  await db('exercise_logs').where('workout_log_id', '=', id).del();

  // Delete the workout log
  await db('workout_logs').where('workout_log_id', '=', id).del();
  res.status(200).json(null);
};

exports.getWorkoutLogById = factory.getById('workout_logs', 'workout_log_id', true, [
  {
    targetTable: 'programs_workouts',
    column: 'program_workout_id',
    targetColumn: 'program_workout_id',
  },
]);

exports.getAllWorkoutLogs = factory.getAll('workout_logs', true, [
  {
    targetTable: 'programs_workouts',
    column: 'program_workout_id',
    targetColumn: 'program_workout_id',
  },
]);
exports.updateWorkoutLog = factory.updateOne('workout_logs', 'workout_log_id');

exports.completeActiveWorkout = async (req, res) => {
  const activeProgramLog = await db('program_logs')
    .where({ status: 'active', user_id: req.user.id })
    .first();

  // RETURN if there is no active workout already
  if (!activeProgramLog.active_workout_log) {
    return res.status(200).json({
      status: 'success',
      data: activeProgramLog,
    });
  }

  // -- Set all logs to inactive
  await db('workout_logs').update({ active: false });

  // -- Set the progress on the active log
  await db('workout_logs')
    .update({ progress: 1 })
    .where('workout_log_id', '=', activeProgramLog.active_workout_log);

  // -- Get current workout log
  let previousWorkoutLog = await db('workout_logs')
    .where('workout_log_id', '=', activeProgramLog.active_workout_log)
    .first();

  // -- Update the active program
  let workoutIndex = 1;
  if (previousWorkoutLog) workoutIndex = previousWorkoutLog.workout_index + 1;

  // -- Get all workouts for program
  let programWorkouts = await db('programs_workouts')
    .select('*')
    .where({ program_id: activeProgramLog.program_id });

  const updatedProgramLog = await db('program_logs')
    .returning('*')
    .update({
      active_workout_log: null,
      next_workout: programWorkouts[workoutIndex].program_workout_id,
      next_workout_date: activeProgramLog.workout_schedule[workoutIndex],
    })
    .where('program_log_id', '=', activeProgramLog.program_log_id);

  // -- Return active program log
  return res.status(200).json({
    status: 'success',
    data: updatedProgramLog[0],
  });
};

const setWorkoutActive = async (workoutLogId, userId, workoutIndex) => {
  // Get the active program log
  const activeProgramLog = await db('program_logs')
    .where({ status: 'active', user_id: userId })
    .first();

  // -- Get all workouts for program
  let programWorkouts = await db('programs_workouts')
    .select('*')
    .where({ program_id: activeProgramLog.program_id });

  // Set the next workout and next workout dates
  let nextWorkout = programWorkouts[workoutIndex + 1];
  let nextWorkoutDate = activeProgramLog.workout_schedule[workoutIndex + 1];

  // Update the program
  await db('program_logs')
    .where({
      status: 'active',
      user_id: userId,
    })
    .update({
      active_workout_log: workoutLogId,
      user_id: userId,
      next_workout: nextWorkout.workout_id,
      next_workout_date: nextWorkoutDate,
      next_workout_index: workoutIndex + 1,
    });
};
