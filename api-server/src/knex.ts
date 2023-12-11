// TODO: is there a convention for the name of this import? Docs use require and immediately invoke.
import knexConfig from 'knex'

console.log('CONNECTED:', process.env)

const knex = knexConfig({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  pool: { min: 0 }
})

export default knex
