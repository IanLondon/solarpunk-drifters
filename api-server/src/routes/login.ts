import express, {
  type RequestHandler,
  type Request,
  type Response,
  type NextFunction
} from 'express'
import { i18n } from '../constants'
import { createUser, getUserWithCredentials } from '../controllers/users'
import { getUserByUid } from '../queries/users'

// TODO IMMEDIATELY factor out or find existing type??
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

const router = express.Router()

// TODO IMMEDIATELY remove. This is an example of an authenticated route
router.get('/private-example', (async (req, res, next): Promise<void> => {
  const { uid } = req.session
  if (uid !== undefined) {
    const user = await getUserByUid(uid)
    if (user !== null) {
      res.send(`Hi ${user.username}. Your uid is ${uid}`)
    }
  } else {
    res.sendStatus(401)
  }
}) as RequestHandler)

// TODO IMMEDIATELY REMOVE
export const footestHandler: RequestHandler = (req, res, next) => {
  const echo: string | undefined = req.body.echo
  res.status(201).json({ result: 'yeah boi', echo })
}
router.post('/footest', footestHandler)

// Create new user
export const createUserHandler: AsyncRequestHandler = async (
  req,
  res,
  next
) => {
  // TODO IMMEDIATELY: validate against OpenAPI schema
  const password: string | undefined = req.body.password
  const username: string | undefined = req.body.username

  if (password === undefined || username === undefined) {
    res
      .status(401)
      .json({ message: i18n.messages.INVALID_USERNAME_OR_PASSWORD })
    return
  }

  const uid = await createUser({ username, password })

  if (uid != null) {
    res.status(201).end()
  } else {
    res.status(400).json({ message: i18n.messages.USERNAME_EXISTS })
  }
}

router.post('/user', createUserHandler as RequestHandler)

// Login existing user
export const loginUserHandler: AsyncRequestHandler = async (req, res, next) => {
  // TODO IMMEDIATELY: validate against OpenAPI schema
  const password: string | undefined = req.body.password
  const username: string | undefined = req.body.username

  if (password === undefined || username === undefined) {
    return res
      .status(401)
      .json({ message: i18n.messages.INVALID_USERNAME_OR_PASSWORD })
  }

  const user = await getUserWithCredentials({ username, password })

  if (user === null) {
    return res
      .status(401)
      .json({ message: i18n.messages.INVALID_USERNAME_OR_PASSWORD })
  } else {
    // user exists and credentials are correct, so we create session

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((err) => {
      if (err !== undefined && err !== null) next(err)

      // store user id in the session
      req.session.uid = user.uid

      return res.status(200).end()
    })
  }
}
router.post('/login', loginUserHandler as RequestHandler)

export default router
