export const API_ROOT = '/api'

// TODO: validate with OpenAPI spec/types somehow...

// Thunks use these
export const GAME_STATE_URL = `${API_ROOT}/game-state`
export const EXPEDITIONS_URL = `${API_ROOT}/expeditions`

// apiSlice uses these, baseUrl uses API_ROOT already
export const drifterCardUrl = (drifterCardId: string): string =>
  `drifter-cards/${drifterCardId}`
export const encounterCardUrl = (encounterCardId: string): string =>
  `encounter-cards/${encounterCardId}`
