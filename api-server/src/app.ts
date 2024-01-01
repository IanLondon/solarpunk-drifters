import 'dotenv/config'
import express, { type Express } from 'express'
import 'express-async-errors'
import addSessionMiddleware from './addSessionMiddleware'
import loginRouter from './routes/login'
import rootRouter from './routes/root'
import gameStateRouter from './routes/game-state'

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
app.use('/login', loginRouter)
app.use('/game-state', gameStateRouter)
