# Solarpunk Drifters

## Monorepo Quick Tour

`website/` is a Next.js static site, the client application to the API server

`api-server/` is an HTTP server for running the game

`common/` contains OpenAPI definition(s) for the API and other common types and constants.

## Local development port mappings

### TL;DR

To run everything locally, run these on separate terminal tabs:

1. `cd api-server; npm run dev`
2. `cd website; npm run dev`
3. `./common/swagger-ui.sh`
4. `./local-dev-reverse-proxy/run-proxy.sh` (this needs to happen last or Nginx will complain)

Then all services can be accessed at `localhost:3000`.

You can also run them in isolation, depending on what you're working on.

### Explanation

`api-server` runs on `localhost:8080`

`website` runs on `localhost:8081`

`common` runs a Swagger UI Docker container on `localhost:8082`

To **avoid CORS issues in local development** in a way that resembles production, we use a reverse proxy to map all the above `localhost` ports to `localhost:3000`:

- `api-server` is at `localhost:3000/api`
- `common`'s Swagger UI server is at `localhost:3000/api-docs`
- `website` is at `localhost:3000/`

The `local-dev-reverse-proxy` has a Dockerfile for the Nginx reverse proxy (and a script that builds and runs it)

## Other ports

Webpack HMR uses a websocket at `ws://localhost:8081`, Nginx passes it through.

Storybook runs by default on `localhost:6006`. It doesn't need to be proxied.
