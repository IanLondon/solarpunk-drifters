import './dotenvConfig'
import express, { type Express } from 'express'
import 'express-async-errors'
import session from 'express-session'
import connectSessionKnex from 'connect-session-knex'
import loginRouter from './routes/login'
import rootRouter from './routes/root'
import knex from './knex'

export const app: Express = express()
app.use(express.json())
const port = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET

if (SESSION_SECRET === undefined) {
  console.error('SESSION_SECRET not defined. Aborting.')
  process.exit(1)
}

// TODO IMMEDIATELY factor out session middleware setup
const KnexSessionStore = connectSessionKnex(session)

const store = new KnexSessionStore({
  knex,
  tablename: 'sessions'
  // TODO IMMEDIATELY uncomment this and create this where tables are bootstrapped
  // createtable: false
})

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

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

// ====

app.disable('x-powered-by')

app.use('/', rootRouter)
app.use('/login', loginRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
