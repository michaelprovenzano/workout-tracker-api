const factory = require('./factoryController');
const db = require('../controllers/databaseController');

exports.addLog = async (req, res) => {
  const activeProgram = await db('program_logs')
    .where({ user_id: req.user.id, status: 'active' })
    .first();

  let workoutLogId = activeProgram.active_workout_log;

  req.body.user_id = req.user.id;
  req.body.workout_log_id = workoutLogId;
  if (!req.body.date) req.body.date = new Date(Date.now());
  req.body.created_at = new Date(Date.now());

  factory.addOne('exercise_logs')(req, res);
};

exports.deleteLog = factory.deleteById('exercise_logs');
exports.getLogById = factory.getById('exercise_logs', true);
exports.getAllLogs = factory.getAll('exercise_logs');
exports.updateLog = factory.updateOne('exercise_logs');
