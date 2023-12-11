import bcrypt from 'bcrypt'
import express, { type RequestHandler } from 'express'
import knex from '../knex'

// TODO IMMEDIATELY factor out
const SALT_ROUNDS = 10

const router = express.Router()

// TODO IMMEDIATELY factor out
interface UsersTableRow {
  uid: number
  username: string
  passhash: string
}

// TODO IMMEDIATELY makes more sense to extend the other way
interface NewUser extends Omit<UsersTableRow, 'uid'> {}

router.post('/debug-fixtures', (async (req, res, next) => {
  // TODO IMMEDIATELY: use migration etc
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

router.get('/private-example', (async (req, res, next) => {
  const { uid } = req.session
  if (uid !== undefined) {
    // TODO use model
    try {
      const user = await knex<UsersTableRow>('users')
        .select('username')
        .where('uid', uid)
        .first()
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

router.post('/', (req, res, next) => {
  // TODO IMMEDIATELY: validate against OpenAPI schema
  const password: string | undefined = req.body.password
  const username: string | undefined = req.body.username

  if (password === undefined || username === undefined) {
    // TODO: DRY this message
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  knex<UsersTableRow>('users')
    .select('*')
    .where('username', username)
    .first()
    .then((user) => {
      if (user === undefined) {
        console.log('(no such user)')
        // TODO: DRY this message
        return res.status(401).json({ message: 'Invalid username or password' })
      } else {
        bcrypt.compare(password, user.passhash).then((result) => {
          if (result === true) {
            // password is a match. successful login, so we create session

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate((err) => {
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
        })
      }
    })
    .catch((err) => {
      next(err)
    })
})

export default router
