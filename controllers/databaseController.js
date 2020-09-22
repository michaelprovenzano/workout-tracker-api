const environment = process.env.NODE_ENV || 'production';
const config = require('../knexfile')[environment];

const db = require('knex')(config);

module.exports = db;

/*
Commands to create a new database
==================================================
createdb 'dbname';
psql 'dbname'

CREATE TABLE login (id serial, email text UNIQUE NOT NULL, password text NOT NULL);
CREATE TABLE users (id serial, email text UNIQUE NOT NULL, name text, createdAt date);
*/
