import { useCallback } from 'react'
import { postExpeditionPlayerMove, useDispatch } from '@/lib/redux'

// TODO: DRY this stuff, error handling (not void return)
type PlayMoveThunk = () => void

export function usePlayDrifterCard(): (drifterCardId: string) => void {
  const dispatch = useDispatch()
  const playDrifterCard = useCallback(
    (drifterCardId: string) => {
      // TODO: use action creator to hide the play `moveType` string
      // TODO: error handling, delete 'void' here
      void dispatch(
        postExpeditionPlayerMove({
          moveType: 'play-drifter-card',
          body: { drifterCardId }
        })
      )
    },
    [dispatch]
  )

  return playDrifterCard
}

export function useBeginExpedition(): PlayMoveThunk {
  const dispatch = useDispatch()
  const beginExpedition = useCallback(() => {
    // TODO: use action creator to hide the play `moveType` string
    // TODO: error handling, delete 'void' here
    void dispatch(postExpeditionPlayerMove({ moveType: 'begin-expedition' }))
  }, [dispatch])
  return beginExpedition
}

export function useNextEncounter(): PlayMoveThunk {
  const dispatch = useDispatch()
  const nextEncounter = useCallback(() => {
    // TODO: use action creator to hide the play `moveType` string
    // TODO: error handling, delete 'void' here
    void dispatch(postExpeditionPlayerMove({ moveType: 'next-encounter' }))
  }, [dispatch])
  return nextEncounter
}

export function useTurnBack(): PlayMoveThunk {
  const dispatch = useDispatch()
  const turnBack = useCallback(() => {
    // TODO: use action creator to hide the play `moveType` string
    // TODO: error handling, delete 'void' here
    void dispatch(postExpeditionPlayerMove({ moveType: 'turn-back' }))
  }, [dispatch])
  return turnBack
}
