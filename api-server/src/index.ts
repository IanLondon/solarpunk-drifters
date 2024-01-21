import { app } from './app'

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Listening on port ${port}. NODE_ENV is ${process.env.NODE_ENV}`)
})
