import knex from '../knex'

export interface UsersTableRow {
  uid: number
  username: string
  passhash: string
}

export interface NewUser extends Omit<UsersTableRow, 'uid'> {}

export async function insertUser (username: string, passhash: string): Promise<number> {
  const ret: Array<{ uid: number }> = await knex<UsersTableRow>('users').returning('uid').insert({ username, passhash })
  if (ret.length === 1) {
    return ret[0].uid
  } else {
    throw new Error('No UID returned from DB after inserting user')
  }
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
