const factory = require('./factoryController');
const db = require('./databaseController');
const moment = require('moment');

exports.addProgramLog = async (req, res) => {
  // Get the program id and add it to the log
  let id = req.body.program_id;

  // Get the workouts for the program
  let programWorkouts = await db.select('*').from('programs_workouts').where('program_id', '=', id);

  // let program = await db.select('*').from('programs').where('program_id', '=', id);
  // program = program[0];

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
  req.body.active_workout_log = undefined;
  req.body.status = 'active';
  req.body.end_date = workoutSchedule[workoutSchedule.length - 1];

  // Make all current programs inactive
  makeAllProgramsInactive(req);

  // Add programLog and send response
  factory.addOne('program_logs')(req, res);
};

exports.postponeNextWorkout = async (req, res, next) => {
  let activeProgram = await db('program_logs').where('status', '=', 'active').first();
  let workoutSchedule = activeProgram.workout_schedule;
  let nextDate = new moment(activeProgram.next_workout_date);

  // Initialize variables for updated dates
  let shift = false;
  let updatedSchedule = [];
  let curDate = new moment(nextDate);

  // Populate updated dates
  workoutSchedule.forEach((date, i) => {
    curDate = new moment(date);
    let nextWorkoutDate = new moment(nextDate);

    // Shift dates in array after next workout date
    if (curDate.isSame(nextWorkoutDate)) shift = true;
    if (shift) {
      curDate = new moment(curDate);
      curDate.add(1, 'days');
    }

    // Add dates to array
    updatedSchedule.push(curDate);
  });

  // Add day to nextDate last
  nextDate = new moment(nextDate);

  // Update the database
  let updatedProgram = await db('program_logs')
    .where('status', '=', 'active')
    .returning('*')
    .update({
      workout_schedule: updatedSchedule,
      next_workout_date: nextDate.add(1, 'days'),
    });

  res.status(200).json({
    status: 'success',
    data: updatedProgram,
  });
};

const makeAllProgramsInactive = async req => {
  let userId = req.user.id;
  await db('program_logs')
    .where({ status: 'active', user_id: userId })
    .update({ status: 'inactive' });
};

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
