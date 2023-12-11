# Dotenv

Add a file `.env` to the root of this directory like:

```
PORT=3000
SESSION_SECRET=sessionSecretHere123
PG_CONNECTION_STRING=postgres://user:secret@host:5432/mydatabasename
```

# Scripts

`npm run dev` - run dev server with nodemon. It will auto-reload when you change what is tracked, eg `*.ts` files

`npm run build && npm run start` - build from TS to `/dist` and run

# Linting & formatting

Uses `standard-with-typescript` and Prettier.
