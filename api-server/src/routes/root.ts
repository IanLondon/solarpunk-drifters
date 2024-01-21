import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('API is running! This is the root, try /api')
})

export default router
