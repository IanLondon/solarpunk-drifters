'use client'
import React, { useEffect } from 'react'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@solarpunk-drifters/common'
import { ConnectedCharacterStatsBar } from '@/components/CharacterStatsBar'
import EncounterResultBar from '@/components/EncounterResultBar'
import LoadingSection from '@/components/LoadingSection'
import { ConnectedProgressMeter } from '@/components/ProgressMeter'
import {
  dismissEncounterResult,
  fetchInitialGameState,
  selectActiveEncounterCardId,
  selectEncounterResult,
  selectGameMode,
  selectRollingDice,
  useDispatch,
  useSelector
} from '@/lib/redux'
import { useBeginExpedition } from '@/lib/playerMoveHooks'
import GameActiveEncounter from './GameActiveEncounter'
import GameBetweenEncounters from './GameBetweenEncounters'
import GameLoadout from './GameLoadout'

export default function PlayPage(): React.ReactNode {
  const dispatch = useDispatch()
  const gameMode = useSelector(selectGameMode)
  const activeEncounterCardId = useSelector(selectActiveEncounterCardId)
  const rollingDice = useSelector(selectRollingDice)
  const encounterResult = useSelector(selectEncounterResult)

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

  if (gameMode === null) {
    // Initial load
    return <LoadingSection />
  }

  let gameComponent = <LoadingSection />

  if (encounterResult !== null || rollingDice !== null) {
    return (
      <EncounterResultBar
        dismissEncounterResult={() => dispatch(dismissEncounterResult())}
        encounterResult={encounterResult}
        rollingDice={rollingDice}
      />
    )
  }

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
      console.error(
        `PlayPage got unexpected gameMode ${JSON.stringify(gameMode)}`
      )
    }
  }

  return (
    <section>
      <ConnectedCharacterStatsBar />
      <ConnectedProgressMeter />
      {gameComponent}
    </section>
  )
}
