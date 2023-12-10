import express, { type Express } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello gentleminn!!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
