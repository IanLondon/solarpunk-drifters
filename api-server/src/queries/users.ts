import connectKnex from '../connectKnex'

export interface UsersTableRow {
  uid: number
  username: string
  passhash: string
}

export interface NewUser extends Omit<UsersTableRow, 'uid'> {}

export async function insertUser (username: string, passhash: string): Promise<number> {
  const knex = connectKnex()

  const ret: Array<{ uid: number }> = await knex<UsersTableRow>('users').returning('uid').insert({ username, passhash })
  if (ret.length === 1) {
    return ret[0].uid
  } else {
    throw new Error('No UID returned from DB after inserting user')
  }
}

export async function getUserByUid (uid: number): Promise<UsersTableRow | null> {
  const knex = connectKnex()

  return await knex<UsersTableRow>('users')
    .select('*')
    .where('uid', uid)
    .first() ?? null
}

export async function getUserByUsername (username: string): Promise<UsersTableRow | null> {
  const knex = connectKnex()

  return await knex<UsersTableRow>('users')
    .select('*')
    .where('username', username)
    .first() ?? null
}
