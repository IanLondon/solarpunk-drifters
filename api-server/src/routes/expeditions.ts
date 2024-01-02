import express, { type RequestHandler } from 'express'
import { beginExpeditionController } from '../controllers/expeditions'

const router = express.Router()

router.post('/begin-expedition', (async (req, res) => {
  const uid = req.session.uid ?? null
  if (uid === null) {
    // TODO IMMEDIATELY this should be a reusable error via error middleware
    return res.sendStatus(401)
  }

  const expeditionRes = await beginExpeditionController(uid)
  res.json(expeditionRes)
}) as RequestHandler)

export default router
