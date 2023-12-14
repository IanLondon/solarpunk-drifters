import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../constants'
import { getUserByUsername, insertUser } from '../queries/users'

// Attempt to create a user. Return the uuid if created, or null if failed.
export async function createUser ({ username, password }: { username: string, password: string }): Promise<number | null> {
  const existingUser = await getUserByUsername(username)
  if (existingUser != null) {
    // user already exists, give up
    return null
  }
  // create a user record, with hashed password
  const passhash = await bcrypt.hash(password, SALT_ROUNDS)
  const uid = await insertUser(username, passhash)

  return uid
}
