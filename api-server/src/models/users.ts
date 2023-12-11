import bcrypt from 'bcrypt'
import knex from '../knex'
import { SALT_ROUNDS } from '../constants'

export interface UsersTableRow {
  uid: number
  username: string
  passhash: string
}

export interface NewUser extends Omit<UsersTableRow, 'uid'> {}

export async function createUser ({ username, password }: { username: string, password: string }): Promise<number | null> {
  const existingUser = await getUserByUsername(username)
  if (existingUser != null) {
    // user already exists, give up
    return null
  }
  // create a user record, with hashed password
  const passhash = await bcrypt.hash(password, SALT_ROUNDS)
  const uid = await knex<UsersTableRow>('users').returning('uid').insert({ username, passhash })
  return uid[0]
}

export async function getUserByUid (uid: number): Promise<UsersTableRow | undefined> {
  return await knex<UsersTableRow>('users')
    .select('*')
    .where('uid', uid)
    .first()
}

export async function getUserByUsername (username: string): Promise<UsersTableRow | undefined> {
  return await knex<UsersTableRow>('users')
    .select('*')
    .where('username', username)
    .first()
}
