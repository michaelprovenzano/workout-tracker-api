const db = require('./databaseController');
const factory = require('./factoryController');

exports.addExercise = async (req, res) => {
  const exercise = await db.returning('id').insert(req.body).into('exercises');
  res.status(200).json(exercise);
};

exports.getExerciseById = factory.getById('exercises', 'exercise_id');

exports.getExercises = async (req, res) => {
  const exercises = await db.select('*').from('exercises');
  res.status(200).json(exercises);
};

exports.updateExercise = factory.updateOne('exercises', 'exercise_id');
