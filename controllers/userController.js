const db = require('./databaseController');
const bcrypt = require('bcrypt');
const factory = require('./factoryController');

exports.register = (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(401).json('Some fields are empty');
  bcrypt.hash(password, 10, (err, hash) => {
    db.transaction(trx => {
      trx
        .insert({
          email: email,
          password: hash,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: email,
              name: name,
              created_at: new Date(),
              role: 'user',
            })
            .then(data => {
              return res.status(200).json(data[0]);
            })
            .catch(err => res.status(400).json(err));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  });
};

exports.getAllUsers = factory.getAll('users');
exports.getUserById = factory.getById('users', 'id');
exports.updateUser = factory.updateOne('users', 'id');
