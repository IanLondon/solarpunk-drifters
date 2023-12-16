// TODO: is there a convention for the name of this import? Docs use require and immediately invoke.
import knexConfig, { type Knex } from 'knex'

// Connect to database once, reuse knex object for subsequent calls.
let knex: Knex | null = null
export default function connectKnex (): Knex {
  if (process.env.ENSURE_NO_DB === '1') {
    throw new Error('ENSURE_NO_DB is set to 1, but connectKnex was called.')
  }

  if (knex === null) {
    console.log('Connecting to database')
    knex = knexConfig({
      client: 'pg',
      connection: process.env.PG_CONNECTION_STRING,
      pool: { min: 0 }
    })
  }
  return knex
}
