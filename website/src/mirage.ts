import { type Server, createServer, Response } from 'miragejs'
import {
  ACTIVE_ENCOUNTER,
  LOADOUT,
  type ServerGameState
} from './types/gameState'
import {
  BEGIN_EXPEDITION,
  NEXT_ENCOUNTER,
  TURN_BACK,
  ENCOUNTER_CARD_CHOICE,
  PLAY_CARD,
  type PlayActionUpdate
} from './lib/redux'
import { DEMO_BUFFALO_ENCOUNTER_CARD } from './dummyData/encounterCards'

const betweenEncountersGameState: ServerGameState = {
  characterStats: {
    agility: 0,
    harmony: 1,
    diy: -1,
    luck: 0
  },
  inventory: {
    rations: 3
  },
  resources: {
    caravanIntegrity: 20
  },
  gameMode: 'BETWEEN_ENCOUNTERS',
  activeEncounterCardId: null,
  expeditionProgress: {
    current: 50,
    total: 1500
  }
}

export function makeMirageServer({ environment = 'test' }): Server {
  console.log('CREATING MIRAGE SERVER...')

  return createServer({
    environment,
    routes() {
      this.namespace = 'api'

      this.get('/game-state', () => {
        // Always just return this static fake initial game state.
        // Anything else that happens, Mirage server will return in responses.
        return betweenEncountersGameState
      })

      this.get('encounter-cards/:cardId', (schema, request) => {
        if (request.params.cardId === DEMO_BUFFALO_ENCOUNTER_CARD.id) {
          return DEMO_BUFFALO_ENCOUNTER_CARD
        }
        return new Response(404, undefined, {
          error: 'No such card ID (at least not in Mirage!)'
        })
      })

      this.post('/play-action/:action', (schema, request) => {
        // Fake responses to play actions, similar to what server would send.
        //
        // Mirage server is a simple fake. It assumes the play action is always valid
        // (even if it wouldn't make sense given the previous game state)
        // and it doesn't respond to most play-actions.
        const action = request.params.action
        let responseUpdate: PlayActionUpdate = {}

        if (action === BEGIN_EXPEDITION) {
          responseUpdate = {
            gameMode: ACTIVE_ENCOUNTER,
            activeEncounterCardId: DEMO_BUFFALO_ENCOUNTER_CARD.id
          }
        } else if (action === NEXT_ENCOUNTER) {
          responseUpdate = {
            gameMode: ACTIVE_ENCOUNTER,
            activeEncounterCardId: DEMO_BUFFALO_ENCOUNTER_CARD.id
          }
        } else if (action === TURN_BACK) {
          responseUpdate = { gameMode: LOADOUT }
        } else if (action === ENCOUNTER_CARD_CHOICE) {
          console.log('Got an encounter card choice:', request.requestBody)
        } else if (action === PLAY_CARD) {
          console.log('Got a play card choice:', request.requestBody)
        } else {
          console.error('Mirage got unexpected play-action/:action', action)
          return new Response(404)
        }
        return new Response(200, undefined, responseUpdate)
      })
    }
  })
}