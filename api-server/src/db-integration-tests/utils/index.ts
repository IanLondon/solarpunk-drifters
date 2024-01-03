import path from 'path'
import connectKnex from '../../connectKnex'
import type { UsersTableRow } from '../../queries/users'

// Should not be stored in dotenv
export const runDbTests = process.env.RUN_DB_TESTS === '1'

function assertRunDbTests(): void {
  if (!runDbTests) {
    throw new Error(
      `RUN_DB_TESTS must be 1 to resetDb. Got: ${process.env.RUN_DB_TESTS}`
    )
  }
}

export async function resetDb(): Promise<void> {
  assertRunDbTests()

  try {
    const knex = connectKnex()
    await knex<UsersTableRow>('users').truncate()

    await knex.seed.run({
      directory: path.join(__dirname, '..', '..', 'knex-cli', 'seeds', 'dev'),
      specific: '000_users.ts'
    })
  } catch (err) {
    console.error(err)
    throw new Error(
      'Could not set up DB for db-integration-tests. Is the test DB running?'
    )
  }
}
