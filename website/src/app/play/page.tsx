'use client'
import React, { useEffect } from 'react'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@solarpunk-drifters/common'
import CharacterStatsBar from '@/components/CharacterStatsBar'
import {
  fetchInitialGameState,
  selectActiveEncounterCardId,
  selectCharacterStats,
  selectExpeditionProgress,
  selectGameMode,
  useDispatch,
  useSelector
} from '@/lib/redux'
import { makeMirageServer } from '@/mirage'
import LoadingSection from '@/components/LoadingSection'
import ProgressMeter from '@/components/ProgressMeter'
import { useBeginExpedition } from '@/lib/playerMoveHooks'
import GameActiveEncounter from './GameActiveEncounter'
import GameBetweenEncounters from './GameBetweenEncounters'
import GameLoadout from './GameLoadout'

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

if (process.env.NEXT_PUBLIC_USE_MIRAGE_SERVER === '1') {
  makeMirageServer({ environment: 'development' })
} else {
  console.log('NO MIRAGE')
}

export default function PlayPage(): React.ReactNode {
  const dispatch = useDispatch()
  const characterStats = useSelector(selectCharacterStats)
  const gameMode = useSelector(selectGameMode)
  const activeEncounterCardId = useSelector(selectActiveEncounterCardId)
  const expeditionProgress = useSelector(selectExpeditionProgress)

  const beginExpedition = useBeginExpedition()

  // Get initial game state from server
  useEffect(() => {
    const get = async (): Promise<void> => {
      try {
        await dispatch(fetchInitialGameState())
      } catch (err) {
        console.error('error fetching initial game state:', err)
      }
    }
    void get()
  }, [dispatch])

  if (gameMode === null || characterStats === null) {
    // Initial load
    return <LoadingSection />
  }

  let progressMeter = null
  if (expeditionProgress !== null) {
    progressMeter = <ProgressMeter {...expeditionProgress} />
  }

  let gameComponent = <LoadingSection />

  switch (gameMode) {
    case LOADOUT: {
      gameComponent = <GameLoadout beginExpedition={beginExpedition} />

      break
    }

    case BETWEEN_ENCOUNTERS: {
      gameComponent = <GameBetweenEncounters />
      break
    }

    case ACTIVE_ENCOUNTER: {
      if (activeEncounterCardId !== null) {
        gameComponent = (
          <GameActiveEncounter activeEncounterCardId={activeEncounterCardId} />
        )
      } else {
        // Loading, or something broke...
      }
      break
    }

    default: {
      gameMode satisfies never
    }
  }

  return (
    <section>
      <CharacterStatsBar stats={characterStats} />
      {progressMeter}
      {gameComponent}
    </section>
  )
}
