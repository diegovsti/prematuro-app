// backend/server.js
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let bebes = []

app.get('/bebes', (req, res) => {
  res.json(bebes)
})

app.post('/bebes', (req, res) => {
  const bebe = req.body
  bebes.push(bebe)
  res.json({ ok: true })
})

app.listen(3000, () => console.log('API rodando em 3000'))
