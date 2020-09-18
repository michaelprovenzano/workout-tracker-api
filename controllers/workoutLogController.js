const db = require('./databaseController');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

exports.addWorkoutLog = catchAsync(async (req, res) => {
  req.body.user_id = req.user.id;
  req.body.created_at = new Date(Date.now());
  req.body.date = req.body.created_at;

  let workout = await db('programs_workouts')
    .select('workout_id')
    .where({ program_workout_id: req.body.program_workout_id })
    .first();
  req.body.workout_id = workout.workout_id;

  if (req.body.active === undefined) req.body.active = true;
  if (!req.body.days_postponed || req.body.days_postponed !== 0) req.body.days_postponed = 0;
  let isActive = req.body.active;

  // If the log is NOT active, create the log and send the response
  if (!isActive) {
    const workoutLog = await db.returning('*').insert(req.body).into('workout_logs');
    return res.status(200).json(workoutLog[0]);
  }

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
  return res.status(200).json(workoutLog[0]);
});

exports.deleteWorkoutLog = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Delete the exercise logs
  await db('exercise_logs').where('workout_log_id', '=', id).del();

  // Delete the workout log
  await db('workout_logs').where('workout_log_id', '=', id).del();
  res.status(200).json(null);
});

exports.getWorkoutLogById = factory.getById('workout_logs', 'workout_log_id', true, [
  {
    targetTable: 'programs_workouts',
    column: 'program_workout_id',
    targetColumn: 'program_workout_id',
  },
  {
    targetTable: 'workouts',
    column: 'workout_id',
    targetColumn: 'workout_id',
  },
]);

exports.getAllWorkoutLogs = factory.getAll('workout_logs', true, [
  {
    targetTable: 'programs_workouts',
    column: 'program_workout_id',
    targetColumn: 'program_workout_id',
  },
  {
    targetTable: 'workouts',
    column: 'workout_id',
    targetColumn: 'workout_id',
  },
]);
exports.updateWorkoutLog = factory.updateOne('workout_logs', 'workout_log_id');

const setWorkoutActive = catchAsync(async (workoutLogId, userId, workoutIndex) => {
  // Get the active program log
  const activeProgramLog = await db('program_logs')
    .where({ status: 'active', user_id: userId })
    .first();

  // -- Get all workouts for program
  let programWorkouts = await db('programs_workouts')
    .select('*')
    .where({ program_id: activeProgramLog.program_id })
    .orderBy('workout_order');

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
      user_id: userId,
      next_workout: nextWorkout.workout_id,
      next_workout_date: nextWorkoutDate,
      next_workout_index: workoutIndex + 1,
      next_program_workout: nextWorkout.program_workout_id,
    });
});
