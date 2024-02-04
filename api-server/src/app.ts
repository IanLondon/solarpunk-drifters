import express, { type Express } from 'express'
import 'express-async-errors'
import addSessionMiddleware from './addSessionMiddleware'
import drifterCardRouter from './routes/drifter-cards'
import encounterCardRouter from './routes/encounter-cards'
import expeditionsRouter from './routes/expeditions'
import gameStateRouter from './routes/game-state'
import healthRouter from './routes/health'
import userRouter from './routes/user'
import rootRouter from './routes/root'
if (process.env.NODE_ENV !== 'production') {
  console.log('Loading .env file into "process.env"')
  require('dotenv/config')
}

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
app.use('/health', healthRouter)
// TODO: use nested router for /api/ ? Leave to another commit.
app.use('/api/drifter-cards', drifterCardRouter)
app.use('/api/encounter-cards', encounterCardRouter)
app.use('/api/expeditions', expeditionsRouter)
app.use('/api/game-state', gameStateRouter)
app.use('/api/user', userRouter)
app.use('*', (req, res) => {
  res
    .status(404)
    .send(`404: route for ${req.method} ${req.originalUrl} does not exist`)
})
