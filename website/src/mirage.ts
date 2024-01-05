import { type Server, createServer, Response } from 'miragejs'
import {
  ACTIVE_ENCOUNTER,
  CLIENT_EVENT_ENCOUNTER_RESULT,
  DEMO_BUFFALO_ENCOUNTER_CARD,
  type ExpeditionUpdate,
  LOADOUT,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  DEMO_MAKE_PROGRESS_DRIFTER_CARD,
  BETWEEN_ENCOUNTERS
} from '@solarpunk-drifters/common'
import { type ServerGameState } from './types/gameState'
import {
  BEGIN_EXPEDITION,
  NEXT_ENCOUNTER,
  TURN_BACK,
  ENCOUNTER_CARD_CHOICE,
  PLAY_DRIFTER_CARD
} from './lib/redux'

const loadoutGameState: ServerGameState = {
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
  gameMode: LOADOUT
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
        return loadoutGameState
      })

      this.get('drifter-cards/:drifterCardId', (schema, request) => {
        const id = request.params.drifterCardId
        if (id === DEMO_MAKE_PROGRESS_DRIFTER_CARD.id) {
          return DEMO_MAKE_PROGRESS_DRIFTER_CARD
        }
        return new Response(404, undefined, {
          error: `No such Encounter Card ID "${id}" (at least not in Mirage!)`
        })
      })

      this.get('encounter-cards/:encounterCardId', (schema, request) => {
        const id = request.params.encounterCardId
        if (id === DEMO_BUFFALO_ENCOUNTER_CARD.id) {
          return DEMO_BUFFALO_ENCOUNTER_CARD
        }
        return new Response(404, undefined, {
          error: `No such Encounter Card ID "${id}" (at least not in Mirage!)`
        })
      })

      this.post('/expeditions/:action', (schema, request) => {
        // Fake responses to encounter moves, similar to what server would send.
        //
        // Mirage server is a simple fake. It assumes the move is always valid
        // (even if it wouldn't make sense given the previous game state)
        // and it doesn't respond to most encounter moves.
        const action = request.params.action
        let responseUpdate: ExpeditionUpdate['update']
        let clientEvents: ExpeditionUpdate['clientEvents']

        if (action === BEGIN_EXPEDITION) {
          responseUpdate = [
            {
              op: 'add',
              path: '/activeEncounterCardId',
              value: DEMO_BUFFALO_ENCOUNTER_CARD.id
            },
            {
              op: 'add',
              path: '/expeditionProgress',
              value: {
                current: 100,
                total: 1500
              }
            },
            {
              op: 'replace',
              path: '/gameMode',
              value: ACTIVE_ENCOUNTER
            }
          ]
        } else if (action === NEXT_ENCOUNTER) {
          responseUpdate = [
            {
              op: 'add',
              path: '/activeEncounterCardId',
              value: DEMO_BUFFALO_ENCOUNTER_CARD.id
            },
            {
              op: 'replace',
              path: '/gameMode',
              value: ACTIVE_ENCOUNTER
            }
          ]
        } else if (action === TURN_BACK) {
          responseUpdate = [
            {
              op: 'replace',
              path: '/gameMode',
              value: LOADOUT
            }
          ]
        } else if (action === ENCOUNTER_CARD_CHOICE) {
          // fake dice roll, assume it's a skill check with mixed success outcome
          responseUpdate = [
            {
              op: 'replace',
              path: '/gameMode',
              value: BETWEEN_ENCOUNTERS
            }
          ]
          clientEvents = [
            {
              type: CLIENT_EVENT_ENCOUNTER_RESULT,
              payload: {
                skillCheckRoll: { rolls: [2, 3, 4], disadvantage: false },
                outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
              }
            }
          ]
        } else if (action === PLAY_DRIFTER_CARD) {
          console.log('Got a play card choice:', request.requestBody)
        } else {
          console.error('Mirage got unexpected expeditions/:action', action)
          return new Response(500)
        }
        const res: ExpeditionUpdate = {
          update: responseUpdate,
          clientEvents
        }
        return new Response(200, undefined, res)
      })

      // TODO: this doesn't fix the problem with Webpack HMR via Next
      // See https://github.com/miragejs/miragejs/issues/651
      // (but those suggestions ^^^ don't work :/ )
      //
      // this.namespace = ''
      // this.passthrough((request) => {
      //   console.log('request.url', request.url)
      //   return !request.url.startsWith('/api/')
      // })
    }
  })
}
