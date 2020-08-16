const db = require('./databaseController');

exports.addExercise = async (req, res) => {
  const exercise = await db.returning('id').insert(req.body).into('exercises');
  res.status(200).json(exercise);
};

exports.getExerciseById = async (req, res) => {
  const { id } = req.params;
  const exercises = await db.select('*').from('exercises').where('id', '=', id);
  res.status(200).json(exercises);
};

exports.getExercises = async (req, res) => {
  const exercises = await db.select('*').from('exercises');
  res.status(200).json(exercises);
};

exports.updateExercise = async (req, res) => {
  const { id } = req.params;

  const exercises = await db.select('*').from('exercises').update(req.body).where('id', '=', id);
  res.status(200).json(exercises);
};
