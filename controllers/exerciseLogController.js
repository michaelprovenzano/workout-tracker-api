const factory = require('./factoryController');
const db = require('../controllers/databaseController');
const catchAsync = require('../utils/catchAsync');

exports.addLog = catchAsync(async (req, res) => {
  await db
    .transaction(async trx => {
      // Set user
      req.body.user_id = req.user.user_id;

      // Calcluate total weight lifted
      req.body.total_weight_lifted = calcTotalWeightLifted(req.body);

      // Get the workout log
      const workoutLog = await trx('workout_logs')
        .where({ user_id: req.user.user_id, active: true })
        .join(
          'programs_workouts',
          'workout_logs.program_workout_id',
          '=',
          'programs_workouts.program_workout_id'
        )
        .first();
      let workoutId = workoutLog.workout_id;
      let workoutLogId = workoutLog.workout_log_id;

      // Calculate the progress
      let progress = await getWorkoutProgress(workoutLogId, workoutId);
      let isActive = true;
      if (progress === 1) isActive = false;

      // Update the workout log
      await trx('workout_logs')
        .update({ progress, active: isActive })
        .where({ user_id: req.user.user_id, workout_log_id: workoutLogId });

      // Update log
      req.body.workout_log_id = workoutLogId;
      if (!req.body.date) req.body.date = new Date(Date.now());
      req.body.created_at = new Date(Date.now());

      // Add a new workout log
      factory.addOne('exercise_logs')(req, res);
    })
    .catch(err => console.log(err));
});

exports.deleteLog = factory.deleteById('exercise_logs', 'exercise_log_id', true);
exports.getLogById = factory.getById('exercise_logs', 'exercise_log_id', true);
exports.getAllLogs = factory.getAll('exercise_logs', true);
exports.updateLog = catchAsync(async (req, res) => {
  req.body.total_weight_lifted = calcTotalWeightLifted(req.body);
  return factory.updateOne('exercise_logs', 'exercise_log_id', true)(req, res);
});

const getWorkoutProgress = catchAsync(async (workoutLogId, workoutId) => {
  // Get all exercises for the workout log
  const workout = await db('workouts').where('workout_id', '=', workoutId).first();
  const exercises = workout.exercises;

  // Get all exercise logs for the current workout
  const exerciseLogs = await db('exercise_logs').where('workout_log_id', '=', workoutLogId);

  // TODO: Compare the two
  const hash = {};

  // Return the progress
  return (exerciseLogs.length + 1) / exercises.length;
});

const calcTotalWeightLifted = data => {
  let { total_weight, weight_left, weight_right, total_reps, reps_left, reps_right } = data;
  if (total_weight) {
    return total_weight * total_reps;
  }
  if (weight_left || weight_right) {
    return weight_left * reps_left + weight_right * reps_right;
  }
  return undefined;
};
