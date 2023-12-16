import { beforeAll, describe, it } from '@jest/globals'
import request from 'supertest'
import { app } from '../app'
import { resetDb } from './utils'

const username = 'integraaation123'
const password = 'integPASS321'

describe('login happy path', () => {
  beforeAll(async () => {
    await resetDb()
  })

  it('should create new user, log in, and get private info', async () => {
    // Reusing an agent retains cookies
    const agent = request.agent(app)

    // it should create a new user upon POST /login/user
    await agent
      .post('/login/user')
      .send({ username, password })
      .expect(201)
      .expect('')

    // it should get a session cookie after successful login
    await agent
      .post('/login/login')
      .send({ username, password })
      .expect(200)
      .expect('')

    // it should let you see private user info when logged in
    await agent
      .get('/login/private-example')
      .expect(200)
      .expect(/^Hi .*\. Your uid is .*/)
  })
})
