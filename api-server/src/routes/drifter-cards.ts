import express, { type RequestHandler } from 'express'
import { getDrifterCard } from '../queries/drifterCards'

const router = express.Router()

router.get('/:drifter_card_id', (async (req, res) => {
  const drifterCardId = req.params.drifter_card_id
  const drifterCard = await getDrifterCard(drifterCardId)
  if (drifterCard === null) {
    res.sendStatus(404) // TODO: JSON error message
  } else {
    res.json(drifterCard)
  }
}) as RequestHandler)

export default router
