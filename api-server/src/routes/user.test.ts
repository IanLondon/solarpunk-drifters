import { describe, expect, it, jest } from '@jest/globals'
import httpMocks from 'node-mocks-http'
import { i18n } from '../constants'
import { createUserHandler, getUserDataHander, loginUserHandler } from './user'

import { createUser, getUserWithCredentials } from '../controllers/users'
import { getUserByUid, type UsersTableRow } from '../queries/users'

jest.mock('../controllers/users')
jest.mock('../queries/users')

const createUserMock = createUser as jest.Mock<typeof createUser>
const getUserWithCredentialsMock = getUserWithCredentials as jest.Mock<
  typeof getUserWithCredentials
>

const getUserByUidMock = getUserByUid as jest.Mock<typeof getUserByUid>

describe('/user', () => {
  describe('POST /user', () => {
    it('should create a new user with valid input', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice', password: 'alicePractice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const uid = '12345'
      createUserMock.mockReturnValue(Promise.resolve(uid))

      await createUserHandler(req, res, next)
      res.end()

      expect(next).not.toHaveBeenCalled()

      expect(createUserMock).toBeCalledTimes(1)
      expect(createUserMock).toHaveBeenCalledWith({
        username: 'alice',
        password: 'alicePractice'
      })

      expect(res._isEndCalled()).toBe(true)
      expect(res._getData()).toEqual('')
      expect(res.statusCode).toEqual(201)
    })

    it('should give error if username already exists', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice', password: 'alicePractice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const uid = null // means user creation failed
      createUserMock.mockReturnValue(Promise.resolve(uid))

      await createUserHandler(req, res, next)

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._isJSON()).toBe(true)
      expect(res._getJSONData()).toEqual({
        message: i18n.messages.USERNAME_EXISTS
      })
      expect(res.statusCode).toEqual(400)
    })

    it('should give error with missing params', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      await createUserHandler(req, res, next)

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._isJSON()).toBe(true)
      expect(res._getJSONData()).toEqual({
        message: i18n.messages.INVALID_USERNAME_OR_PASSWORD
      })
      expect(res.statusCode).toEqual(401)
    })

    describe('GET /user', () => {
      it('should give 401 error when the given user does not exist', async () => {
        const uid = '1234'
        getUserByUidMock.mockReturnValue(Promise.resolve(null))

        const req = httpMocks.createRequest({
          method: 'GET',
          session: { uid }
        })
        const res = httpMocks.createResponse()
        const next = jest.fn()

        await getUserDataHander(req, res, next)

        expect(next).not.toHaveBeenCalled()

        expect(res._isEndCalled()).toBe(true)
        expect(res.statusCode).toEqual(401)
      })
      it('should give user data if the session is valid', async () => {
        const uid = '1234'
        const username = 'alice'
        const passhash = 'blah'
        getUserByUidMock.mockReturnValue(
          Promise.resolve({ uid, username, passhash })
        )

        const req = httpMocks.createRequest({
          method: 'GET',
          session: { uid }
        })
        const res = httpMocks.createResponse()
        const next = jest.fn()

        await getUserDataHander(req, res, next)

        expect(next).not.toHaveBeenCalled()

        expect(res._isEndCalled()).toBe(true)
        expect(res._isJSON()).toBe(true)
        expect(res._getJSONData()).toEqual({ username })
        expect(res.statusCode).toEqual(200)
      })
    })
  })

  describe('POST /user/login', () => {
    it('should give error with missing params', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      await loginUserHandler(req, res, next)

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._isJSON()).toBe(true)
      expect(res._getJSONData()).toEqual({
        message: i18n.messages.INVALID_USERNAME_OR_PASSWORD
      })
      expect(res.statusCode).toEqual(401)
    })

    it('should give error with bad credentials', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice', password: 'alicePractice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      getUserWithCredentialsMock.mockReturnValue(Promise.resolve(null))

      await loginUserHandler(req, res, next)

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._isJSON()).toBe(true)
      expect(res._getJSONData()).toEqual({
        message: i18n.messages.INVALID_USERNAME_OR_PASSWORD
      })
      expect(res.statusCode).toEqual(401)
    })

    it('should set req.session.uid if username and password are correct', async () => {
      // NOTE: this simple fake ignores error handling of the session.regenerate fn
      const regenerate = (cb: (x?: any) => void): void => {
        cb()
      }

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice', password: 'alicePractice' },
        session: { regenerate }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const uid = '123456'
      const passhash = 'fakeHash123'
      const user: UsersTableRow = { username: 'alice', uid, passhash }
      getUserWithCredentialsMock.mockReturnValue(Promise.resolve(user))

      await loginUserHandler(req, res, next)

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._getData()).toBe('')
      expect(res.statusCode).toEqual(200)
      // TODO IMMEDIATELY: add session to httpMocks.MockRequest
      expect((req as any).session.uid).toEqual(uid)
    })
  })
})
