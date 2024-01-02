import { describe, expect, it, jest } from '@jest/globals'
import { createUser, getUserWithCredentials } from './users'

import bcrypt from 'bcrypt'
import { insertUser, getUserByUsername } from '../queries/users'

jest.mock('bcrypt')
jest.mock('../queries/users')
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>
const insertUserMock = insertUser as jest.Mock<typeof insertUser>
const getUserByUsernameMock = getUserByUsername as jest.Mock<
  typeof getUserByUsername
>

// this user exists before each test
const existingUser = {
  username: 'ursulaLeGuin',
  password: 'Disp0ssessed',
  passhash: 'fakePASShash',
  uid: 1233321
} as const

// this user doesn't yet exist before each test
const newUser = {
  username: 'nkJemisin',
  password: 'br0kenEarth',
  passhash: 'anotherFakeHash',
  uid: 909090
} as const

insertUserMock.mockImplementation(async (username, passhash) => {
  if (username === existingUser.username) {
    throw new Error('cannot insert user, username already exists')
  }
  return newUser.uid
})

getUserByUsernameMock.mockImplementation(async (username) => {
  if (username === existingUser.username) {
    return {
      username: existingUser.username,
      uid: existingUser.uid,
      passhash: existingUser.passhash
    }
  }
  // new user does not exist, cannot be retrieved
  return null
})

bcryptMock.hash.mockImplementation(
  async (password: string | Buffer, rounds) => {
    if (password === existingUser.password) {
      return existingUser.passhash
    } else if (password === newUser.password) {
      return newUser.passhash
    }
    throw new Error(`Unhandled mock case: password "${password.toString()}"`)
  }
)

bcryptMock.compare.mockImplementation(async (password, passhash) => {
  return (
    password === existingUser.password && passhash === existingUser.passhash
  )
})

describe('createUser', () => {
  it('should return the user id after user is created', async () => {
    const result = await createUser({
      username: newUser.username,
      password: newUser.password
    })

    expect(result).toEqual(newUser.uid)
  })

  it('should return null if user already exists', async () => {
    const result = await createUser({
      username: existingUser.username,
      password: existingUser.password
    })

    expect(result).toBe(null)
  })
})

describe('getUserWithCredentials', () => {
  it('should return the user data if credentials match', async () => {
    const result = await getUserWithCredentials({
      username: existingUser.username,
      password: existingUser.password
    })

    expect(result).toEqual({
      username: existingUser.username,
      uid: existingUser.uid,
      passhash: existingUser.passhash
    })
  })

  it('should return null if the username does not exist', async () => {
    const result = await getUserWithCredentials({
      username: 'thisUsernameDoesntExist',
      password: 'pass123whatever'
    })

    expect(result).toBe(null)
  })

  it('should return null if the password does not match the username', async () => {
    const result = await getUserWithCredentials({
      username: existingUser.username,
      password: 'badnotgoodpassword'
    })

    expect(result).toBe(null)
  })
})
