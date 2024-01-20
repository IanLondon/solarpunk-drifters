import type { Knex } from 'knex'

const config: Record<string, Knex.Config> = {
  development: {
    client: 'postgresql',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds/dev'
    }
  },

  // NOTE: this is meant to be run via an SSH tunnel,
  // which is why it's localhost as host.
  // Pass env vars PGPORT, PGDATABASE, PGUSER
  // and set either PGPASSWORD or use .pgpass
  production: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      ssl: false
      // ssl: {
      //   rejectUnauthorized: false
      // }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
