// NOTE: these are not used, using RTK Query instead.
// If these won't integrate with RTK Query, delete them.
//
/* eslint-disable @typescript-eslint/no-unused-vars */

// NOTE: allow return type to be inferred by the fn, bc it all derives
// from the OpenAPI generated types via openapi-fetch anyway.
//
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import createClient from 'openapi-fetch'
import { type paths } from '@solarpunk-drifters/common'

const BASE_API_URL = '/api/'

const client = createClient<paths>({ baseUrl: BASE_API_URL })

async function getDrifterCard(drifterCardId: string) {
  const { data, error } = await client.GET('/drifter-cards/{drifter_card_id}', {
    params: {
      path: { drifter_card_id: drifterCardId }
    }
  })
  return { data, error }
}

async function getEncounterCard(encounterCardId: string) {
  const { data, error } = await client.GET(
    '/encounter-cards/{encounter_card_id}',
    {
      params: {
        path: { encounter_card_id: encounterCardId }
      }
    }
  )
  return { data, error }
}

// const { data, error } = await client.PUT('/blogposts', {
//   body: {
//     title: 'New Post',
//     body: '<p>New post body</p>',
//     publish_date: new Date('2023-03-01T12:00:00Z').getTime()
//   }
// })
