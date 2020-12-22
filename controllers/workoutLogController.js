const db = require('./databaseController');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

exports.addWorkoutLog = catchAsync(async (req, res) => {
  req.body.user_id = req.user.user_id;
  req.body.created_at = new Date(Date.now());
  if (!req.body.date) req.body.date = req.body.created_at;

  // Check if workout exists first
  let workoutLog = await db('workout_logs')
    .where({
      program_log_id: req.body.program_log_id,
      program_workout_id: req.body.program_workout_id,
    })
    .first();

  if (workoutLog)
    return res.status(409).json({
      status: 'fail',
      data: 'This workout already exists for this program',
    });

  // Get workout_id (necessary for the joining workout data)
  let programWorkout = await db('programs_workouts')
    .where({ program_workout_id: req.body.program_workout_id })
    .first();
  req.body.workout_id = programWorkout.workout_id;

  factory.addOne('workout_logs')(req, res);
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

exports.updateWorkoutLog = factory.updateOne('workout_logs', 'workout_log_id', true);
