'use client'
import * as React from 'react'
import { useGetUserDataQuery } from '../lib/redux'

export function ConnectedPlayButton(): React.ReactNode {
  const { data, isFetching, isLoading } = useGetUserDataQuery()
  if (isFetching || isLoading) {
    return null
  }
  if (data === null || data === undefined) {
    return null
  }
  return <a href='/play'>PLAY</a>
}
