require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seed, getDeck, createUser, createDeck, modifyDeck, deleteDeck, deleteUser} = require('./controller.js')

app.use(express.json())
app.use(cors())

//seed the database
app.post('/seed', seed)

//common function
app.get('/decklist', getDeck)

//users
app.post('/users', createUser)
app.delete('/users/:username', deleteUser)

//decklists
app.post('/decklist', createDeck)
app.put('/decklist', modifyDeck)
app.delete('/decklist', deleteDeck)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))