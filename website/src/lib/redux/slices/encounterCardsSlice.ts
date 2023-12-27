import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENCOUNTER_CARD_URL } from '../../../app/serverRoutes'

export const encounterCardSlice = createApi({
  reducerPath: 'encounterCard',
  baseQuery: fetchBaseQuery({ baseUrl: ENCOUNTER_CARD_URL }),
  endpoints: (builder) => ({
    getCard: builder.query({
      query: (cardId: string): string => `/${cardId}`
    })
  })
})

export const { useGetCardQuery } = encounterCardSlice
