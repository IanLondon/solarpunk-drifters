import dotenv from 'dotenv'
import { checkEnvVarsForDb } from '../connectKnex'
import type { Knex } from 'knex'

if (process.env.NODE_ENV !== 'production') {
  console.log('loading env vars from .env')
  dotenv.config({
    // NOTE: running knex commands like "npx knex seed:run" will
    // cd to this file's parent directory. So to get the .env file,
    // we need to move up to api-server/ from api-server/src/knex-cli
    path: '../../.env'
  })
}

checkEnvVarsForDb()

const config: Record<string, Knex.Config> = {
  development: {
    client: 'postgresql',
    connection: {
      ssl: false
    },
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
