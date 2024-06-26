import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../constants'
import {
  type UsersTableRow,
  getUserByUsername,
  insertUser
} from '../queries/users'

export interface UsernamePassword {
  username: string
  password: string
}

// Attempt to create a user. Return the user id if created, or null if user already exists.
export async function createUser({
  username,
  password
}: UsernamePassword): Promise<string | null> {
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

// Get a user matching the given credentials if the username exists and the password
// is correct, or null otherwise.
export async function getUserWithCredentials({
  username,
  password
}: UsernamePassword): Promise<UsersTableRow | null> {
  const user = await getUserByUsername(username)
  if (user === null) {
    return null
  }

  const matchResult = await bcrypt.compare(password, user.passhash)

  return matchResult ? user : null
}
