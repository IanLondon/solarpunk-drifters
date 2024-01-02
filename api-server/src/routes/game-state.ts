import express, { type RequestHandler } from 'express'
import { getGameStateForUser } from '../controllers/gameState'

const router = express.Router()

router.get('/', (async (req, res) => {
  const uid = req.session.uid ?? null
  if (uid === null) {
    // TODO IMMEDIATELY this should be a reusable error via error middleware
    return res.sendStatus(401)
  }
  const gameState = await getGameStateForUser(uid)

  if (gameState === null) {
    // TODO IMMEDIATELY this should be a reusable error via error middleware
    return res.sendStatus(401)
  }

  res.json(gameState)
}) as RequestHandler)

export default router
