const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    // host: process.env.DATABASE_URL,
    // user: 'michaelprovenzano',
    // password: '',
    // database: 'workout-tracker-api',
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
