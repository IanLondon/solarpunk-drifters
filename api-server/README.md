# Dotenv

Add a file `.env` to the root of this directory like:

```bash
# the port the server listens on
PORT=8080

# a secret for generating sessions
SESSION_SECRET=sessionSecretHere123

# used to connect to postgres database
PG_CONNECTION_STRING=postgres://user:secret@host:5432/mydatabasename

# Prohibits knex from connecting to the DB via `connectKnex()` if set to 1.
# Useful to ensure that unit tests aren't using the DB, see README for more details
# ENSURE_NO_DB=1
```

## Other environmental variables

- `RUN_DB_TESTS`: Set to `1` to allow integration tests to modify the connected database. Do not include it in your `.env` file, because that would make it easy accidentally run the database integration tests, which will destructively modify whatever database is connected to it. (This is used in `npm run test-db-integration`)

# Tests

`npm run test` runs all unit tests.

`npm run test-db-integration` runs all unit tests, as well as all database integation tests. **Do not run the database integration tests when connected to a database you care about.** All database integration tests are inside `src/db-integration-tests`. They clear, read, and write to the connected database specified in `PG_CONNECTION_STRING`. (The environment variable `RUN_DB_TESTS=1` is set by this npm script, if it is unset the tests would fail as a safeguard against accidental use, eg by running `jest` outside of the npm scripts.) The integration tests use Supertest, and run the Express app on an ephemeral port.

# Database connection

In development, the app can run:

## Connected to a local dev db

Via `npm run dev`, on your own machine. Connected to the DB specified in `PG_CONNECTION_STRING` env var. That DB is up to you to manage, maybe it's a remote DB, maybe you're hosting it from your machine directly or in a Docker container. It's easy to set up a new DB with using the Knex CLI to set up migrations and seeds.

See `docker-compose.yml` for the recommended postgres image and the `knex` commands to set up a new database.

## With no database (unit tests)

With no database. As long as `connectKnex()` is never called, no DB connection will be made. This is only suitable for running unit tests where anything that touches the DB is mocked. Use `ENSURE_NO_DB=1` to prevent connection to the DB and throw an error if `connectKnex()` is called. If set, `express-session` will use `MemoryStore` instead of persisting to a database.

## Inside Docker Compose, with an included ephemeral DB

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
