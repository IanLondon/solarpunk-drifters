import connectKnex from '../connectKnex'
import { createUserGameData } from './gameState'

export interface UsersTableRow {
  uid: string
  username: string
  passhash: string
}

export interface NewUser extends Omit<UsersTableRow, 'uid'> {}

export async function insertUser(
  username: string,
  passhash: string
): Promise<string> {
  const knex = connectKnex()

  const ret: Array<{ uid: string }> = await knex<UsersTableRow>('users')
    .returning('uid')
    .insert({ username, passhash })
  if (ret.length === 1) {
    const uid = ret[0].uid
    await createUserGameData(uid)
    return uid
  } else {
    throw new Error('No UID returned from DB after inserting user')
  }
}

export async function getUserByUid(uid: string): Promise<UsersTableRow | null> {
  const knex = connectKnex()

  return (
    (await knex<UsersTableRow>('users')
      .select('*')
      .where('uid', uid)
      .first()) ?? null
  )
}

export async function getUserByUsername(
  username: string
): Promise<UsersTableRow | null> {
  const knex = connectKnex()

  return (
    (await knex<UsersTableRow>('users')
      .select('*')
      .where('username', username)
      .first()) ?? null
  )
}
