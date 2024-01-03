import createClient from 'openapi-fetch'
import { type paths } from '@solarpunk-drifters/common'

const BASE_API_URL = '/api/'

export const { GET, POST } = createClient<paths>({ baseUrl: BASE_API_URL })

// use like this
async function getEncounterCard(cardId: string): Promise<any> {
  const { data, error } = await GET('/encounter-cards/{card_id}', {
    params: {
      path: { card_id: 'my-post' }
    }
  })
  return { data, error }
}

// const { data, error } = await PUT('/blogposts', {
//   body: {
//     title: 'New Post',
//     body: '<p>New post body</p>',
//     publish_date: new Date('2023-03-01T12:00:00Z').getTime()
//   }
// })
