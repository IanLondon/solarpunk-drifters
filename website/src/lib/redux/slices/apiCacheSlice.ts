import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  API_ROOT,
  drifterCardUrl,
  encounterCardUrl,
  loginUrl,
  userUrl
} from '@/app/serverRoutes'
import {
  type UserData,
  type UserLogin,
  type DrifterCard,
  type EncounterCard
} from '@solarpunk-drifters/common'

export const apiCacheSlice = createApi({
  reducerPath: 'apiCache',
  baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
  tagTypes: ['UserData'],
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
    }),

    // USERS
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUserData: builder.query<UserData | null, void>({
      query: () => userUrl,
      providesTags: ['UserData']
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    createUser: builder.mutation<void, UserLogin>({
      query: (params: UserLogin) => ({
        url: userUrl,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['UserData']
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    login: builder.mutation<void, UserLogin>({
      query: (params: UserLogin) => ({
        url: loginUrl,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['UserData']
    })
  })
})

export const {
  useCreateUserMutation,
  useGetDrifterCardQuery,
  useGetEncounterCardQuery,
  useGetUserDataQuery,
  useLoginMutation
} = apiCacheSlice
