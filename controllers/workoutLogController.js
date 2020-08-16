const db = require('./databaseController');
const factory = require('./factoryController');

exports.addWorkoutLog = async (req, res) => {
  req.body.user_id = req.user.id;
  req.body.active = true;
  req.body.created_at = new Date(Date.now());

  const workoutLog = await db.returning('*').insert(req.body).into('workout_logs');
  setWorkoutActive(workoutLog[0].id, req.user.id);
  res.status(200).json(workoutLog[0]);
};

exports.deleteWorkoutLog = factory.deleteById('workout_logs');

exports.getWorkoutLogById = async (req, res) => {
  const { id } = req.params;
  const workouts = await db.select('*').from('workout_logs').where('id', '=', id);
  res.status(200).json(workouts);
};

exports.getAllWorkoutLogs = factory.getAll('workout_logs');

exports.getWorkoutLog = async (req, res) => {
  const workouts = await db.select('*').from('workout_logs');
  res.status(200).json(workouts);
};

exports.updateWorkoutLog = async (req, res) => {
  const { id } = req.params;

  const workouts = await db.select('*').from('workout_logs').update(req.body).where('id', '=', id);
  res.status(200).json(workouts);
};

const setWorkoutActive = async (workoutLogId, userId) => {
  console.log(workoutLogId, userId);
  // Update the program
  const program = await db('program_logs')
    .where({
      status: 'active',
      user_id: userId,
    })
    .update({ active_workout_log: workoutLogId, user_id: userId });
};
