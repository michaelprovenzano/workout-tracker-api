const db = require('./databaseController');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

exports.addProgram = catchAsync(async (req, res) => {
  const workout = await db.returning('program_id').insert(req.body).into('programs');
  res.status(200).json(workout);
});

exports.getProgramById = factory.getById('programs', 'program_id', true, [
  {
    targetTable: 'programs_workouts',
    column: 'id',
    targetColumn: 'program_id',
  },
]);

exports.getAllPrograms = catchAsync(async (req, res) => {
  const workouts = await db.select('*').from('programs');
  res.status(200).json(workouts);
});

exports.updateProgram = catchAsync(async (req, res) => {
  const { id } = req.params;

  const workouts = await db
    .returning('*')
    .select('*')
    .from('programs')
    .update(req.body)
    .where('program_id', '=', id);

  res.status(200).json(workouts[0]);
});
