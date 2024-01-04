import express, { type RequestHandler } from 'express'
import { getEncounterCard } from '../queries/encounterCards'

const router = express.Router()

router.get('/:encounter_card_id', (async (req, res) => {
  const encounterCardId = req.params.encounter_card_id
  const encounterCard = await getEncounterCard(encounterCardId)
  if (encounterCard === null) {
    res.sendStatus(404) // TODO: JSON error message
  } else {
    res.json(encounterCard)
  }
}) as RequestHandler)

export default router
