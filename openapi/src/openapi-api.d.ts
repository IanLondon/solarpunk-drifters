/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/game-state": {
    /** @description Get the current game state for a player */
    get: {
      responses: {
        /** @description The game state */
        200: {
          content: {
            "application/json": components["schemas"]["GameState"];
          };
        };
      };
    };
  };
  "/encounter-cards/{card_id}": {
    /** @description Get a single Encounter Card */
    get: {
      parameters: {
        path: {
          card_id: string;
        };
      };
      responses: {
        /** @description A single Encounter Card */
        200: {
          content: {
            "application/json": {
              /** @example some-id-123-blah */
              id: string;
              /** @example Buffalo Migration */
              title: string;
              /** @example You come across a migrating herd of buffalo. Their ranks stretch back to the horizon. */
              description: string;
              image: components["schemas"]["ImageInfo"];
              choices: components["schemas"]["EncounterChoice"][];
            };
          };
        };
      };
    };
  };
  "/expeditions/begin-expedition": {
    /** @description Begin an expedition */
    post: {
      responses: {
        /** @description Successfully began expedition. Response contains ExpeditionUpdate */
        200: {
          content: {
            "application/json": components["schemas"]["ExpeditionUpdate"];
          };
        };
      };
    };
  };
  "/expeditions/next-encounter": {
    /** @description Begin next encounter (draw a new encounter card) */
    post: {
      responses: {
        /** @description Successfully began new encounter. Response contains ExpeditionUpdate */
        200: {
          content: {
            "application/json": components["schemas"]["ExpeditionUpdate"];
          };
        };
      };
    };
  };
  "/expeditions/turn-back": {
    /** @description Turn back, ending the expedition. */
    post: {
      responses: {
        /** @description Successfully ended the expedition. Response contains ExpeditionUpdate */
        200: {
          content: {
            "application/json": components["schemas"]["ExpeditionUpdate"];
          };
        };
      };
    };
  };
  "/expeditions/encounter-card-choice": {
    /** @description Make a choice on the active encounter card */
    post: {
      /** @description A player choice for the active encounter card */
      requestBody?: {
        content: {
          "application/json": {
            choice?: number;
          };
        };
      };
      responses: {
        /** @description Successfully executed a choice. Response contains ExpeditionUpdate */
        200: {
          content: {
            "application/json": components["schemas"]["ExpeditionUpdate"];
          };
        };
      };
    };
  };
  "/expeditions/play-card": {
    /** @description Play a card in the player's hand (between encounters) */
    post: {
      /** @description A request to play a card from a player's hand */
      requestBody?: {
        content: {
          "application/json": {
            cardId?: string;
          };
        };
      };
      responses: {
        /** @description Successfully played a card. Response contains ExpeditionUpdate */
        200: {
          content: {
            "application/json": components["schemas"]["ExpeditionUpdate"];
          };
        };
      };
    };
  };
  "/login/user": {
    /** @description Create a new user */
    post: {
      /** @description A username and password */
      requestBody?: {
        content: {
          "application/json": components["schemas"]["UserLogin"];
        };
      };
      responses: {
        /** @description Successfully created a new user. */
        201: {
          content: never;
        };
        /** @description Error. User already exists */
        400: {
          content: never;
        };
        /** @description Error. Incorrect parameters. */
        401: {
          content: never;
        };
      };
    };
  };
  "/login/login": {
    /** @description Log in an existing user account */
    post: {
      requestBody: paths["/login/user"]["post"]["requestBody"];
      responses: {
        /** @description Successful login, obtain a session cookie to be used in subsequent requests */
        200: {
          headers: {
            "Set-Cookie"?: string;
          };
          content: never;
        };
        /** @description Invalid username or password */
        401: {
          content: never;
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    CharacterStats: {
      agility: components["schemas"]["StatNumber"];
      diy: components["schemas"]["StatNumber"];
      harmony: components["schemas"]["StatNumber"];
      luck: components["schemas"]["StatNumber"];
    };
    EncounterChoice: {
      description: string;
      check?: components["schemas"]["EncounterCheck"];
      risk?: components["schemas"]["EncounterRisk"];
    };
    EncounterCheck: {
      /** @enum {string} */
      skill?: "agility" | "diy" | "harmony" | "luck";
      item?: {
        [key: string]: number;
      };
    };
    EncounterRisk: {
      loseItem?: string | null;
      loseResource?: string | null;
      loomingDangerIncrease?: number | null;
    };
    ExpeditionProgress: {
      current: number;
      total: number;
    };
    ExpeditionUpdate: {
      rollResult?: components["schemas"]["RollResult"];
      update?: components["schemas"]["GameState"];
    };
    CoreGameState: {
      characterStats?: components["schemas"]["CharacterStats"];
      inventory?: {
        [key: string]: number;
      };
      resources?: {
        [key: string]: number;
      };
    };
    ActiveEncounterGameState: {
      /** @enum {string} */
      gameMode?: "ACTIVE_ENCOUNTER";
      activeEncounterCardId?: string;
      expeditionProgress?: components["schemas"]["ExpeditionProgress"];
    };
    BetweenEncountersGameState: {
      /** @enum {string} */
      gameMode?: "BETWEEN_ENCOUNTERS";
      expeditionProgress?: components["schemas"]["ExpeditionProgress"];
    };
    LoadoutGameState: {
      /** @enum {string} */
      gameMode?: "LOADOUT";
    };
    GameState: components["schemas"]["CoreGameState"] & (components["schemas"]["ActiveEncounterGameState"] | components["schemas"]["BetweenEncountersGameState"] | components["schemas"]["LoadoutGameState"]);
    ImageInfo: {
      alt: string;
      height: number;
      width: number;
      src: string;
    };
    RollResult: {
      rolls: number[];
    };
    StatNumber: number;
    UserLogin: {
      username: string;
      password: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
