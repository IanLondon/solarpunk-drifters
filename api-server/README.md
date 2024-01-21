# Dotenv

Add a file `.env` to the root of this directory like:

```bash
# the port the server listens on
PORT=8080

# a secret for generating sessions
SESSION_SECRET=sessionSecretHere123

# used to connect to postgres database
PGDATABASE=postgres
PGHOST=localhost
PGPASSWORD=localDbPasswordHere
PGPORT=5432
PGUSER=postgres

# Prohibits knex from connecting to the DB via `connectKnex()` if set to 1.
# Useful to ensure that unit tests aren't using the DB, see README for more details
# ENSURE_NO_DB=1
```

## Other environmental variables

- `RUN_DB_TESTS`: Set to `1` to allow integration tests to modify the connected database. Do not include it in your `.env` file, because that would make it easy accidentally run the database integration tests, which will destructively modify whatever database is connected to it. (This is used in `npm run test-db-integration`)

# Tests

`npm run test` runs all unit tests.

`npm run test-db-integration` runs all unit tests, as well as all database integation tests. **Do not run the database integration tests when connected to a database you care about.** All database integration tests are inside `src/db-integration-tests`. They clear, read, and write to the connected database specified in `PG_CONNECTION_STRING`. (The environment variable `RUN_DB_TESTS=1` is set by this npm script, if it is unset the tests would fail as a safeguard against accidental use, eg by running `jest` outside of the npm scripts.) The integration tests use Supertest, and run the Express app on an ephemeral port.

# Seeding and migrating the database

Seeds are intended only for local development. Start a local Postgres server and do:

`npx knex seed:run --knexfile src/knex-cli/knexfile.ts`

Migrations must be applied to local Postgres server as well as the the production database.

`NODE_ENV=development npx knex migrate:latest --knexfile src/knex-cli/knexfile.ts` (you can omit `NODE_ENV` for development.)

`NODE_ENV=production npx knex migrate:latest --knexfile src/knex-cli/knexfile.ts`

NOTE: Do not use knex CLI's `--env` parameter, set the `NODE_ENV`.

# Database connection

In development, the app can run:

## Connected to a local dev db

Via `npm run dev`, on your own machine. Connected to the DB specified in `PG_CONNECTION_STRING` env var. That DB is up to you to manage, maybe it's a remote DB, maybe you're hosting it from your machine directly or in a Docker container. It's easy to set up a new DB with using the Knex CLI to set up migrations and seeds.

See `docker-compose.yml` for the recommended postgres image and the `knex` commands to set up a new database.

## With no database (unit tests)

With no database. As long as `connectKnex()` is never called, no DB connection will be made. This is only suitable for running unit tests where anything that touches the DB is mocked. Use `ENSURE_NO_DB=1` to prevent connection to the DB and throw an error if `connectKnex()` is called. If set, `express-session` will use `MemoryStore` instead of persisting to a database.

## Building api-server as a Docker container

Due to the barebones npm-workspaces monorepo structure, we need to build the Dockerfile from the monorepo root in order to get the root-level `package-lock.json` and `node_modules/`.

From the monorepo root: `docker build . -f api-server/Dockerfile -t api-server-dev-test` (or whatever tag you want)

## Docker container local dev testing

Assuming a local postgres server is running, accessible at `postgres://postgres:$dbPasswordHere@localhost:5432/postgres`, run the container with env vars needed to make the connection as below.

(NOTE: This is only tested on linux, mac/win might require different host network config but I think this is cross-compatible?)

```bash
docker run --init \
--add-host=host.docker.internal:host-gateway \
-p 8080:8080 \
-e PORT=8080 \
-e PGDATABASE=postgres \
-e PGHOST=host.docker.internal \
-e PGPASSWORD=dbPasswordHere \
-e PGPORT=5432 \
-e PGUSER=postgres \
-e SESSION_SECRET=session-secret-123 \
api-server-dev-test # or whatever tag you want
```

## Inside Docker Compose, with an included ephemeral DB

TODO: might need updating!!

In Docker Compose. Connected to the DB created alongside it. This database intentionally has no volume attached to it, its contents are ephemeral. When started up in Docker Compose, all Knex migrations are seeds are applied to the DB as soon as the `app` container starts, and the Express server starts immediately after that process.

Docker compose example: running database integration tests

```bash
docker compose up --build -d
docker compose exec app npm run test-db-integration
```

# Other scripts

`npm run dev` - run dev server with nodemon. It will auto-reload when you change what is tracked, eg `*.ts` files

`npm run build && npm run start` - build from TS to `/dist` and run

# Linting & formatting

Uses `standard-with-typescript` and Prettier.

# Game Core Domain Logic

Software Design Goals for Core Domain Logic:

- Isolate the domain logic (behaviors specific to the game mechanics) so that is it free of any dependencies. It should not have any awareness of how data is stored or of any client or transport layer.
- Decouple it from data persistence
- Decouple it from transport/communication concerns by driving it through a small, simple interface that speaks in domain language, eg "the player has made the move 'draw an encounter card'".

I've chosen two implementation tactics to organize how the core domain is implemented:

- **Functional core, imperative shell**.
  - I prefer functional approaches to OOP, especially in a funky language like TypeScript. Functional code is easy to reason about and test. I like to think about data transformations rather than building layers of abstract APIs which can make it hard to understand what the inputs and outputs are.
- **Event sourcing / Command pattern**. I'm using these terms quite generally to describe "using events plus a previous state to derive a new state." This pattern decouples the complex domain logic concerned with producing game events from the downstream effects of those events, allowing the domain logic to be written in a pure manner and tested in isolation without complex mocks.

The "game domain" is partitioned into layers:

- `gameLogicLayer`: this is given read-only access to data and is also given a "player move". It outputs `GameEvent`s describing the changes that should happen in response to the move and the current state, or it outputs a `GameErrorEvent` (usually the error is something like "this move is not allowed").
- `gamePersistenceLayer`: given the output of `gameLogicLayer`, the persistence layer actually effects the changes to the state. It may fail if if the `gameLogicLayer` produced an invalid `GameEvent`, due to an implementation bug or because the data changed since the `gameLogicLayer` read it. It interacts with a `GameStore`, which abstracts away the details of how data is written.
  - The persistence layer operates on an abstract interface, the `GameStore`. This is in line with the "ports and adapters model" -- ports provide this abstract interface, adapters are the implementation(s) of the interface.
- `gameTransportLayer`: The transport layer handles sending the changes to the client(s) via HTTP responses to requests or WebSocket messages. If there was an error in either the `gameLogicLayer` or the `gamePersistenceLayer`, that error will be relayed to the client (eg, "you can't use that item because it's already gone"). Otherwise if there are no upstream errors, the transport layer informs the client(s) of what happened in the `GameEvent`s. This includes game state updates, and also transient relevant events like the outcome of a dice roll or the reason an expedition ended.

`GameEvents` describe changes that happen within the game, as a result of a "player move". Many of these events are used by the persistence and transport layers to update backend and client-side state, but some events are purely informational (eg, transiently displayed to players in the UI).

**DESIGN**: `GameEvent`s should be designed to be descriptive, "what happened". They should be modeled as events, not setters. They should be designed in a way that is decoupled from any implementation details of the game state -- though events like "add item to inventory" presume there is an inventory of items with quantities, the event should not depend on assumptions about the data type or persistence mechanism of that inventory. It's up to downstream effector layers to actually do things with `GameEvent`s. A single `GameEvent` might change multiple parts of the game state, or just one, or might not affect the state at all.

- They should also contain sufficient information to describe what happened in the game. For example, if we had an event like "the player rolled 3 dice" but didn't include the results of the rolls, it would be difficult for downstream effectors to arrive at matching outcomes. They'd need to awkwardly share random number generation state.

`GameEvent`s can become stale. For example:

- The `gameLogicLayer` reads character stats and generates events based on those stats
- Something changes the character stats, after the `gameLogicLayer` has read them but before the downstream effectors have read them. (Maybe the client send two requests simultaneously, to the same or different server instances.)
- The events are now stale and no longer valid.
