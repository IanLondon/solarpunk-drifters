import express, { type RequestHandler } from 'express'
import {
  beginExpeditionController,
  encounterCardChoiceController,
  nextEncounterController,
  playDrifterCardController,
  turnBackController
} from '../controllers/expeditions'

const router = express.Router()

// NOTE: could also use req.params, eg '/:playerAction', but this
// approach feels more explicit, as it will pass through any other paths
// regardless of how the routing middleware is ordered.
const BEGIN_EXPEDITION_PATH = '/begin-expedition'
const NEXT_ENCOUNTER_PATH = '/next-encounter'
const TURN_BACK_PATH = '/turn-back'
const ENCOUNTER_CARD_CHOICE_PATH = '/encounter-card-choice'
const PLAY_DRIFTER_CARD_PATH = '/play-card'

router.post(
  [
    BEGIN_EXPEDITION_PATH,
    NEXT_ENCOUNTER_PATH,
    TURN_BACK_PATH,
    ENCOUNTER_CARD_CHOICE_PATH,
    PLAY_DRIFTER_CARD_PATH
  ],
  (async (req, res, next) => {
    const { path } = req
    const uid = req.session.uid ?? null
    if (uid === null) {
      // TODO IMMEDIATELY this should be a reusable error via error middleware
      return res.sendStatus(401)
    }

    if (path === BEGIN_EXPEDITION_PATH) {
      const expeditionRes = await beginExpeditionController(uid)
      res.json(expeditionRes)
    } else if (path === NEXT_ENCOUNTER_PATH) {
      const expeditionRes = await nextEncounterController(uid)
      res.json(expeditionRes)
    } else if (path === TURN_BACK_PATH) {
      const expeditionRes = await turnBackController(uid)
      res.json(expeditionRes)
    } else if (path === ENCOUNTER_CARD_CHOICE_PATH) {
      // TODO: validate input with OpenAPI definition
      const choiceIndex: number = req.body.choice
      const expeditionRes = await encounterCardChoiceController({
        uid,
        choiceIndex
      })

      res.json(expeditionRes)
    } else if (path === PLAY_DRIFTER_CARD_PATH) {
      // TODO: rename this route to `/play-drifter-card`
      // and use `drifterCardId` not `cardId`

      // TODO: validate input with OpenAPI definition
      const drifterCardId: string = req.body.cardId
      const expeditionRes = await playDrifterCardController({
        uid,
        drifterCardId
      })
      res.json(expeditionRes)
    } else {
      throw new Error(
        `expeditions/:action POST router got unexpected path: ${path}`
      )
    }
  }) as RequestHandler
)

export default router
