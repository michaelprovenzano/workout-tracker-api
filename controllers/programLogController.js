const factory = require('./factoryController');
const db = require('./databaseController');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');

exports.addProgramLog = catchAsync(async (req, res) => {
  console.log('adding log');

  // Get the program id and add it to the log
  let id = req.body.program_id;

  // Get the workouts for the program
  let programWorkouts = await db.select('*').from('programs_workouts').where('program_id', '=', id);

  // Set start date if one isn't set (necessary for laying out program timeline)
  if (!req.body.start_date) req.body.start_date = new Date(Date.now());
  let workoutDate = req.body.start_date;

  // Create an array of dates for the program
  let workoutSchedule = [];
  programWorkouts.forEach(workout => {
    workoutSchedule.push(new Date(workoutDate));
    workoutDate.setDate(workoutDate.getDate() + 1);
  });

  // Update the req.body object
  req.body.user_id = req.user.id;
  req.body.created_at = new Date(Date.now());
  req.body.workout_schedule = workoutSchedule;
  req.body.next_workout = programWorkouts[0].program_workout_id;
  req.body.next_workout_date = workoutSchedule[0];
  req.body.next_workout_index = 0;
  req.body.next_program_workout = programWorkouts[0].program_workout_id;
  req.body.status = 'active';
  req.body.end_date = workoutSchedule[workoutSchedule.length - 1];

  // Make all current programs inactive
  makeAllProgramsInactive(req);

  // Add programLog and send response
  factory.addOne('program_logs')(req, res);
});

const makeAllProgramsInactive = catchAsync(async req => {
  let userId = req.user.id;
  await db('program_logs')
    .where({ status: 'active', user_id: userId })
    .update({ status: 'abandoned' });
});

exports.getProgramLogById = factory.getById('program_logs', 'program_log_id', true, [
  {
    targetTable: 'programs',
    column: 'program_id',
    targetColumn: 'program_id',
  },
]);

exports.getAllProgramLogs = factory.getAll('program_logs', true, [
  {
    targetTable: 'programs',
    column: 'program_id',
    targetColumn: 'program_id',
  },
]);

exports.updateProgramLog = factory.updateOne('program_logs', 'program_log_id');

exports.deleteProgramLog = factory.deleteById('program_logs', 'program_log_id');

exports.getProgramStats = catchAsync(async (req, res) => {
  db.transaction(async trx => {
    const programLogId = req.params.programLogId;
    const currentLogQuery = trx('workout_logs').where({
      program_log_id: programLogId,
      user_id: req.user.id,
    });

    const programLog = await trx('program_logs').where({
      program_log_id: programLogId,
      user_id: req.user.id,
    });

    const workouts = await trx('programs_workouts')
      .where({ program_id: programLog[0].program_id })
      .orderBy('workout_order');

    const workoutLogs = await trx('workout_logs')
      .where({
        program_log_id: programLogId,
        user_id: req.user.id,
      })
      .orderBy('date');

    let totalWeightLifted = await trx('workout_logs')
      .sum('exercise_logs.total_weight')
      .where('program_log_id', '=', programLogId)
      .join('exercise_logs', 'workout_logs.workout_log_id', '=', 'exercise_logs.workout_log_id')
      .groupBy('exercise_logs.total_weight_lifted');
    totalWeightLifted[0] ? (totalWeightLifted = totalWeightLifted[0].sum) : (totalWeightLifted = 0);

    const skippedWorkouts = await currentLogQuery.count('skipped').first();
    const totalCompletedWorkouts = await currentLogQuery.count('*').first();
    let totalRemainingWorkouts;
    if (workouts.length)
      totalRemainingWorkouts =
        workouts.length - totalCompletedWorkouts.count - skippedWorkouts.count;

    // Get streaks
    const streaks = calcStreaks(workoutLogs);
    let currentStreak;
    streaks.length ? (currentStreak = streaks[streaks.length - 1].length) : (currentStreak = 0);

    // Best streak
    streaks.sort((a, b) => a - b);
    let bestStreak;
    streaks[0] ? (bestStreak = streaks[0].length) : (bestStreak = 0);

    // Calculate progress
    let progress = 0;
    if (workoutLogs.length && workouts.length) progress = workoutLogs.length / workouts.length;

    // Create calendar array
    let workoutLogHash = {};
    for (let i = 0; i < workoutLogs.length; i++) {
      workoutLogHash[workoutLogs[i].program_workout_id] = workoutLogs[i];
    }

    let calendarArray = [];
    for (let i = 0; i < workouts.length; i++) {
      let workout = workouts[i];
      if (workoutLogHash[workout.program_workout_id]) {
        let { date, skipped } = workoutLogHash[workout.program_workout_id];
        calendarArray.push({ complete: true, date, skipped });
      } else {
        calendarArray.push({ complete: false });
      }
    }

    return {
      progress: progress,
      calendar: calendarArray,
      totalSkippedWorkouts: skippedWorkouts.count,
      totalCompletedWorkouts: totalCompletedWorkouts.count,
      totalRemainingWorkouts: totalRemainingWorkouts,
      totalWeightLifted: totalWeightLifted,
      currentStreak: currentStreak,
      bestStreak: bestStreak,
      streaks,
    };
  })
    .then(stats => {
      return res.status(200).json({
        status: 'success',
        data: stats,
      });
    })
    .catch(err => console.log(err));
});

const calcStreaks = logs => {
  let allStreaks = [];
  let curStreak = [];
  let lastLog, difference;

  for (let i = 0; i < logs.length; i++) {
    if (lastLog) {
      let startDate = moment(lastLog.date).startOf('day');
      let curDate = moment(logs[i].date).endOf('day');
      difference = curDate.diff(startDate, 'days');
    }

    if (i !== 0 && difference > 2) {
      allStreaks.push(curStreak);
      curStreak = [];
    }
    lastLog = logs[i];
    curStreak.push(logs[i]);

    if (i === logs.length - 1) allStreaks.push(curStreak);
  }
  return allStreaks;
};
