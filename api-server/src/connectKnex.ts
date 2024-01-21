// TODO: is there a convention for the name of this import? Docs use require and immediately invoke.
import knexConfig, { type Knex } from 'knex'

function errorIfUnset(envVar: string): void {
  const value = process.env[envVar]
  if (value === undefined || value === '') {
    throw new Error(
      `${envVar} is unset, but this is required for DB connection.`
    )
  }
}

function warnIfUnset(envVar: string): void {
  const value = process.env[envVar]
  if (value === undefined || value === '') {
    console.warn(
      `${envVar} is unset, pg will use default value for DB connection.`
    )
  }
}

// TODO: factor out, bc this is used by knexfile.ts too
export function checkEnvVarsForDb(): void {
  errorIfUnset('PGPASSWORD')

  const warnList = ['PGDATABASE', 'PGHOST', 'PGPORT', 'PGUSER']
  warnList.forEach(warnIfUnset)

  console.log({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: '(hidden)', // expect a warning if it's unset, pg defaults it to "postgres"
    password: '(hidden)' // expect an error if it's unset
  })
}

// Connect to database once, reuse knex object for subsequent calls.
let knex: Knex | null = null
export default function connectKnex(): Knex {
  if (process.env.ENSURE_NO_DB === '1') {
    throw new Error('ENSURE_NO_DB is set to 1, but connectKnex was called.')
  }

  checkEnvVarsForDb()

  if (knex === null) {
    console.log('Connecting to database')
    knex = knexConfig({
      client: 'pg',
      connection: {
        ssl: false
      },
      pool: { min: 0 }
    })
  }
  return knex
}
