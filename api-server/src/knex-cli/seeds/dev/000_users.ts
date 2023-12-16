import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../../constants'
import { type Knex } from 'knex'
import { type NewUser, type UsersTableRow } from '../../../queries/users'
import { type UsernamePassword } from '../../../controllers/users'

async function passToHash ({ username, password }: UsernamePassword): Promise<NewUser> {
  const passhash = await bcrypt.hash(password, SALT_ROUNDS)
  return { username, passhash }
}

export async function seed (knex: Knex): Promise<void> {
  const rawUsers: UsernamePassword[] = [
    { username: 'alice', password: 'alicePractice' },
    { username: 'bob', password: 'bobYouOut' }
  ]

  const users = await Promise.all(rawUsers.map(passToHash))

  // Upserts seed entries
  await knex<UsersTableRow>('users')
    .insert(users)
    .onConflict('uid')
    .merge()
};
