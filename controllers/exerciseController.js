const db = require('./databaseController');
const factory = require('./factoryController');

exports.addExercise = async (req, res) => {
  const exercise = await db.returning('id').insert(req.body).into('exercises');
  res.status(200).json(exercise);
};

exports.getExerciseById = factory.getById('exercises', 'exercise_id', true);
exports.getExercises = factory.getAll('exercises', true);
exports.updateExercise = factory.updateOne('exercises', 'exercise_id');
