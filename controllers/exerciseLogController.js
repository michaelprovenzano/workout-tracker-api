const factory = require('./factoryController');
const db = require('../controllers/databaseController');

exports.addLog = async (req, res) => {
  await db
    .transaction(async trx => {
      // Set user
      req.body.user_id = req.user.id;

      // Get the active program
      const activeProgram = await trx('program_logs')
        .where({ user_id: req.user.id, status: 'active' })
        .first();
      let currentWorkoutLogId = activeProgram.active_workout_log;

      // Get the workout log
      const workoutLog = await trx('workout_logs')
        .where({ user_id: req.user.id, workout_log_id: currentWorkoutLogId })
        .join(
          'programs_workouts',
          'workout_logs.program_workout_id',
          '=',
          'programs_workouts.program_workout_id'
        )
        .first();
      let workoutId = workoutLog.workout_id;

      // Calculate the progress
      let progress = await getWorkoutProgress(currentWorkoutLogId, workoutId);

      // Update the workout log
      await trx('workout_logs')
        .update({ progress })
        .where({ user_id: req.user.id, workout_log_id: currentWorkoutLogId });

      // If workout is complete change the active workout log for all future exercise logs
      if (progress === 1) {
        // -- Get current workout log
        let previousWorkoutLog = await trx('workout_logs')
          .returning('*')
          .update({ active: false })
          .where('workout_log_id', '=', workoutLog.workout_log_id);
        previousWorkoutLog = previousWorkoutLog[0];

        // -- Set workout log to inactive
        await trx('workout_logs')
          .update({ active: false })
          .where({ workout_log_id: previousWorkoutLog.workout_log_id });

        // -- Get all workouts for active program
        let programWorkouts = await trx('programs_workouts')
          .select('*')
          .where({ program_id: activeProgram.program_id })
          .orderBy('workout_order', 'asc');

        // -- Update the active program
        let workoutIndex = 0;
        if (previousWorkoutLog) workoutIndex = previousWorkoutLog.workout_index + 1;

        await trx('program_logs')
          .update({
            active_workout_log: null,
            next_workout: programWorkouts[workoutIndex].program_workout_id,
            next_workout_date: activeProgram.workout_schedule[workoutIndex],
          })
          .where('program_log_id', '=', activeProgram.program_log_id);
      }

      // Update log
      req.body.workout_log_id = currentWorkoutLogId;
      if (!req.body.date) req.body.date = new Date(Date.now());
      req.body.created_at = new Date(Date.now());

      // Add a new workout log
      factory.addOne('exercise_logs')(req, res);
    })
    .catch(err => console.log(err));
};

exports.deleteLog = factory.deleteById('exercise_logs', 'exercise_log_id');
exports.getLogById = factory.getById('exercise_logs', 'exercise_log_id', true);
exports.getAllLogs = factory.getAll('exercise_logs');
exports.updateLog = factory.updateOne('exercise_logs', 'exercise_log_id');

const getWorkoutProgress = async (workoutLogId, workoutId) => {
  // Get all exercises for the workout log
  const workout = await db('workouts').where('workout_id', '=', workoutId).first();
  const exercises = workout.exercises;

  // Get all exercises for the current workout
  const exerciseLogs = await db('exercise_logs').where('workout_log_id', '=', workoutLogId);

  // Compare the two
  const hash = {};

  // Return the progress
  return (exerciseLogs.length + 1) / exercises.length;
};
