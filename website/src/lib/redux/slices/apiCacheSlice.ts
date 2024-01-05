import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROOT, drifterCardUrl, encounterCardUrl } from '@/app/serverRoutes'
import {
  type DrifterCard,
  type EncounterCard
} from '@solarpunk-drifters/common'

export const apiCacheSlice = createApi({
  reducerPath: 'apiCache',
  baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
  endpoints: (builder) => ({
    getDrifterCard: builder.query<DrifterCard, string>({
      query: drifterCardUrl
    }),
    // NOTE: this might be useful but I can't get the types to validate,
    // and it makes loading "all or none" eg all cards loaded or none are...
    // which might be desirable...
    //
    // getDrifterCards: builder.query<DrifterCard[], string[]>({
    //   async queryFn(arg, _queryApi, _extraOptions, baseQuery) {
    //     const drifterCardIds = arg
    //     const results = await Promise.all(
    //       drifterCardIds.map((id) => baseQuery(`drifter-cards/${id}`))
    //     )
    //     for (const r of results) {
    //       if (r.error !== undefined) {
    //         return r.error
    //       }
    //     }

    //     const drifterCards: DrifterCard[] = results.map(
    //       (r) => r.data as DrifterCard
    //     )
    //     return { data: drifterCards }
    //   }
    // }),
    getEncounterCard: builder.query<EncounterCard, string>({
      query: encounterCardUrl
    })
  })
})

export const { useGetDrifterCardQuery, useGetEncounterCardQuery } =
  apiCacheSlice
