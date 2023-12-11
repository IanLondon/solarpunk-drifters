import bcrypt from 'bcrypt'
import express, { type RequestHandler } from 'express'
import knex from '../knex'
import { getUserByUid, getUserByUsername, createUser, type NewUser } from '../models/users'
import { SALT_ROUNDS } from '../constants'

const router = express.Router()

// TODO IMMEDIATELY: use migration etc
router.post('/debug-fixtures', (async (req, res, next) => {
  try {
    await knex.schema
      .dropTableIfExists('users')
      .createTable('users', (table) => {
        table.uuid('uid').primary().defaultTo(knex.fn.uuid())
        table.string('username')
        table.string('passhash')
      })

    // Alice's password is '123password'
    const passhash = await bcrypt.hash('123password', SALT_ROUNDS)

    const aliceUser: NewUser = {
      username: 'Alice',
      passhash
    }
    await knex('users').insert(aliceUser)

    res.status(200).send('added fixtures')
  } catch (err) {
    next(err)
  }
}) as RequestHandler)

// TODO IMMEDIATELY remove. This is an example of an authenticated route
router.get('/private-example', (async (req, res, next) => {
  const { uid } = req.session
  console.log('session', req.session)
  if (uid !== undefined) {
    try {
      const user = await getUserByUid(uid)
      if (user !== undefined) {
        res.send(`Hi ${user.username}. Your uid is ${uid}`)
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.sendStatus(401)
  }
}) as RequestHandler)

// Create new user
router.post('/user', (async (req, res, next) => {
  // TODO IMMEDIATELY: validate against OpenAPI schema
  const password: string | undefined = req.body.password
  const username: string | undefined = req.body.username

  if (password === undefined || username === undefined) {
    // TODO: DRY this message
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  try {
    const uid = await createUser({ username, password })
    if (uid != null) {
      res.status(201).json({ message: 'User created' })
    } else {
      res.status(400).json({ message: 'Username already exists' })
    }
  } catch (err) {
    next(err)
  }
}) as RequestHandler)

// Login existing user
router.post('/login', (async (req, res, next) => {
  // TODO IMMEDIATELY: validate against OpenAPI schema
  const password: string | undefined = req.body.password
  const username: string | undefined = req.body.username

  if (password === undefined || username === undefined) {
    // TODO: DRY this message
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  try {
    const user = await getUserByUsername(username)
    console.log('user', user)
    if (user === undefined) {
      console.log('(no such user)')
      // TODO: DRY this message
      return res.status(401).json({ message: 'Invalid username or password' })
    } else {
      const matchResult = await bcrypt.compare(password, user.passhash)
      if (matchResult) {
        // password is a match. successful login, so we create session

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
          // TODO: what is the type of this error?
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (err) next(err)

          // store user information in session, typically a user id
          req.session.uid = user.uid

          return res.status(200).end()
        })
      } else {
        // bad password
        console.log('(bad password)')
        return res
          .status(401)
          .json({ message: 'Invalid username or password' })
      }
    }
  } catch (err) {
    next(err)
  }
}) as RequestHandler)

export default router
