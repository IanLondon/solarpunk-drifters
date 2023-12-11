import express from 'express'
import knex from '../knex'

const router = express.Router()

interface FooTable {
  n: number
  s: string
}

router.get('/', (req, res) => {
  knex<FooTable>('foo')
    .first()
    .then((row) => {
      console.log({ row })
    })
    .catch(console.error)

  res.send('Hello gentleminn!!')
})

export default router
