// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'workout-tracker-api',
      user: 'michaelprovenzano',
      password: '',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
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

//     client: 'pg',
//     host: '127.0.0.1',
//     database: 'workout-tracker-api',
//     user: 'michaelprovenzano',
//     password: '',
