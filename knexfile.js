// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgress://localhost/jwt_test',
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
