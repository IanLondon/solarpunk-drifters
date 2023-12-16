import { type Express } from 'express'
import session from 'express-session'
import connectSessionKnex from 'connect-session-knex'
import connectKnex from './connectKnex'

export function getSessionStore (): session.Store {
  if (process.env.ENSURE_NO_DB === '1') {
    console.log('ENSURE_NO_DB=1, using MemoryStore for express-session.')
    return new session.MemoryStore()
  }

  console.log('Using KnexSessionStore for express-session.')
  const knex = connectKnex()
  const KnexSessionStore = connectSessionKnex(session)

  const store = new KnexSessionStore({
    knex,
    tablename: 'sessions'
    // TODO IMMEDIATELY uncomment this and create this where tables are bootstrapped
    // createtable: false
  })
  return store
}

export function addSessionMiddlewareFactory (app: Express, store: session.Store): Express {
  const SESSION_SECRET = process.env.SESSION_SECRET

  if (SESSION_SECRET === undefined) {
    throw new Error('SESSION_SECRET not defined.')
  }

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: app.get('env') === 'production'
      },
      store
    })
  )

  return app
}

export default function addSessionMiddleware (app: Express): Express {
  return addSessionMiddlewareFactory(app, getSessionStore())
}
