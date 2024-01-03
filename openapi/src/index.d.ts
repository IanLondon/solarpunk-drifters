import type { components, paths } from "./openapi-api";

export { paths };

export * from "./common";

// Turn messy auto-generated types into nicer named types
export type ActiveEncounterGameState =
  components["schemas"]["ActiveEncounterGameState"];

export type BetweenEncountersGameState =
  components["schemas"]["BetweenEncountersGameState"];

export type CharacterStats = components["schemas"]["CharacterStats"];

export type CoreGameState = components["schemas"]["CoreGameState"];

export type EncounterCheck = components["schemas"]["EncounterCheck"];

export type EncounterChoice = components["schemas"]["EncounterChoice"];

export type EncounterRisk = components["schemas"]["EncounterRisk"];

export type ExpeditionProgress = components["schemas"]["ExpeditionProgress"];

export type ExpeditionUpdate = components["schemas"]["ExpeditionUpdate"];

export type GameState = Required<components["schemas"]["GameState"]>;

export type ImageInfo = components["schemas"]["ImageInfo"];

export type LoadoutGameState = components["schemas"]["LoadoutGameState"];

export type RollResult = components["schemas"]["RollResult"];

export type StatNumber = components["schemas"]["StatNumber"];

export type UserLogin = components["schemas"]["UserLogin"];
