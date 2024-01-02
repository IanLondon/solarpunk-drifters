import 'dotenv/config'
import express, { type Express } from 'express'
import 'express-async-errors'
import addSessionMiddleware from './addSessionMiddleware'
import expeditionsRouter from './routes/expeditions'
import gameStateRouter from './routes/game-state'
import loginRouter from './routes/login'
import rootRouter from './routes/root'

export const app: Express = express()

app.use(express.json())
app.disable('x-powered-by')

// Proxy

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  // required with express-session to get the correct value for req.secure
}

// Session middleware

addSessionMiddleware(app)

// Routes

app.use('/', rootRouter)
app.use('/expeditions', expeditionsRouter)
app.use('/game-state', gameStateRouter)
app.use('/login', loginRouter)
