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

## "In the Weeds" Coding Convention Notes

### Nominal Typing with `_brand` convention

TypeScript is structurally typed, so with `interface A {type: string}` and `interface B {type: string}`, these `A` and `B` are just different names for the same structure. For things like `ClientEvent` and `GameEvent` types, structural typing doesn't allow us to reliably and explicitly discriminate between these types.

Languages with nominal typing would take `A` and `B` as different types, because though they're structurally the same, they have different names. How can we get TypeScript to give us compile-time errors when we put `A` somewhere meant exclusively for `B`?

One approach is to use Symbols instead of strings for the discriminant property's value, but `ClientEvent` in particular is meant to be serialized and sent to the client.

Instead, we take the "brand" approach. In `common/`, `ClientEvent` is given `_clientEventBrand: any`. This is following a (somewhat obscure) TypeScript convention [used by the TS team](https://github.com/Microsoft/TypeScript/blob/7b48a182c05ea4dea81bab73ecbbe9e013a79e99/src/compiler/types.ts#L693-L698). The brands are never given values, it's just a TS trick to get nominal.

(This does require disabling `@typescript-eslint/consistent-type-assertions` in the functions that create these "branded" objects, bc they rely on `return {...blah} as SomeEventType`.)
