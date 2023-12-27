'use client'
import React, { useCallback, useEffect } from 'react'
import CharacterStatsBar from '@/components/CharacterStatsBar'
import {
  fetchInitialGameState,
  postPlayAction,
  selectActiveEncounterCardId,
  selectCharacterStats,
  selectExpeditionProgress,
  selectGameMode,
  useDispatch,
  useSelector
} from '@/lib/redux'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@/types/gameState'
import { DEMO_MAKE_PROGRESS } from '@/dummyData/cardsInHand'
import { makeMirageServer } from '@/mirage'
import LoadingSection from '@/components/LoadingSection'
import ProgressMeter from '@/components/ProgressMeter'
import GameActiveEncounter from './GameActiveEncounter'
import GameBetweenEncounters from './GameBetweenEncounters'
import GameLoadout from './GameLoadout'

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'development') {
  makeMirageServer({ environment: 'development' })
}

export default function PlayPage(): React.ReactNode {
  const dispatch = useDispatch()
  const characterStats = useSelector(selectCharacterStats)
  const gameMode = useSelector(selectGameMode)
  const activeEncounterCardId = useSelector(selectActiveEncounterCardId)
  const expeditionProgress = useSelector(selectExpeditionProgress)

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

  const beginExpedition = useCallback(() => {
    // TODO: use action creator to hide the play `action` string
    // TODO: error handling, delete 'void' here
    void dispatch(postPlayAction({ action: 'begin-expedition' }))
  }, [dispatch])

  const nextEncounter = useCallback(() => {
    // TODO: use action creator to hide the play `action` string
    // TODO: error handling, delete 'void' here
    void dispatch(postPlayAction({ action: 'next-encounter' }))
  }, [dispatch])

  const turnBack = useCallback(() => {
    // TODO: use action creator to hide the play `action` string
    // TODO: error handling, delete 'void' here
    void dispatch(postPlayAction({ action: 'turn-back' }))
  }, [dispatch])

  const playCardFromHand = useCallback(
    (cardId: string) => {
      // TODO: use action creator to hide the play `action` string
      // TODO: error handling, delete 'void' here
      void dispatch(
        postPlayAction({ action: 'play-card', payload: { cardId } })
      )
    },
    [dispatch]
  )

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
      gameComponent = (
        <GameBetweenEncounters
          nextEncounter={nextEncounter}
          turnBack={turnBack}
          cardsInHand={[DEMO_MAKE_PROGRESS]} // TODO use actual card inventory
          onCardSelect={playCardFromHand}
        />
      )
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
