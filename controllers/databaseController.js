const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'michaelprovenzano',
    password: '',
    database: 'workout-tracker-api',
  },
});

module.exports = db;

/*
Commands to create a new database
==================================================
createdb 'dbname';
psql 'dbname'

CREATE TABLE login (id serial, email text UNIQUE NOT NULL, password text NOT NULL);
CREATE TABLE users (id serial, email text UNIQUE NOT NULL, name text, createdAt date);
*/
