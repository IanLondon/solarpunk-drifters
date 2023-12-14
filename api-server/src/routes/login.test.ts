import httpMocks from 'node-mocks-http'
import { describe, expect, it, jest } from '@jest/globals'
import { createUserHandler, footestHandler } from './login'
import type { NextFunction } from 'express'

import { createUser } from '../controllers/users'
import { i18n } from '../constants'

jest.mock('../controllers/users')
const createUserMock = createUser as jest.Mock<typeof createUser>

describe('/login', () => {
  // TODO IMMEDIATELY REMOVE
  describe('POST /footest', () => {
    it('should 201, echo and say "yeah boi"', () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { echo: 'echoThis123' }
      })
      const res = httpMocks.createResponse()
      const next: NextFunction = jest.fn()

      footestHandler(req, res, next)

      expect(res.statusCode).toEqual(201)
      expect(res._getJSONData()).toEqual({ echo: 'echoThis123', result: 'yeah boi' })
    })
  })

  describe('POST /user', () => {
    it('should create a new user with valid input', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { username: 'alice', password: 'alicePractice' }
      })
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const uid = 12345
      createUserMock.mockReturnValue(Promise.resolve(uid))

      await createUserHandler(req, res, next)
      res.end()

      expect(next).not.toHaveBeenCalled()

      expect(res._isEndCalled()).toBe(true)
      expect(res._isJSON()).toBe(true)
      expect(res._getJSONData()).toEqual({ uid })
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
      expect(res._getJSONData()).toEqual({ message: i18n.messages.USERNAME_EXISTS })
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
      expect(res._getJSONData()).toEqual({ message: i18n.messages.INVALID_USERNAME_OR_PASSWORD })
      expect(res.statusCode).toEqual(401)
    })
  })
})
