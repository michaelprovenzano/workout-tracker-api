const db = require('./databaseController');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

exports.addProgram = factory.addOne('programs', false);

exports.getProgramById = factory.getById('programs', 'program_id', false);

exports.getAllPrograms = factory.getAll('programs', false);
exports.updateProgram = factory.updateOne('programs', 'program_id', false);
