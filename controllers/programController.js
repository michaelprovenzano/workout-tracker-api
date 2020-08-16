const db = require('./databaseController');

exports.addProgram = async (req, res) => {
  const workout = await db.returning('id').insert(req.body).into('programs');
  res.status(200).json(workout);
};

exports.getProgramById = async (req, res) => {
  const { id } = req.params;
  const workouts = await db.select('*').from('programs').where('id', '=', id);
  res.status(200).json(workouts);
};

exports.getAllPrograms = async (req, res) => {
  const workouts = await db.select('*').from('programs');
  res.status(200).json(workouts);
};

exports.updateProgram = async (req, res) => {
  const { id } = req.params;

  const workouts = await db
    .returning('*')
    .select('*')
    .from('programs')
    .update(req.body)
    .where('id', '=', id);

  res.status(200).json(workouts[0]);
};
