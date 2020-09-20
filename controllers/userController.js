const db = require('./databaseController');
const bcrypt = require('bcrypt');
const factory = require('./factoryController');

exports.getAllUsers = factory.getAll('users');
exports.getUserById = factory.getById('users', 'id');
exports.updateUser = factory.updateOne('users', 'id');
