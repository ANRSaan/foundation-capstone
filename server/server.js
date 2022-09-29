require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {seed, getDeck, createUser, createDeck, modifyDeck, deleteDeck, deleteUser} = require('./controller.js')

app.use(express.json())
app.use(cors())

//seed the database
app.post('/api/seed', seed)

//common function
app.get('/api/decklist', getDeck)

//users
app.post('/api/users', createUser)
app.delete('/api/users/:username', deleteUser)

//decklists
app.post('/api/decklist', createDeck)
app.put(/*'/api/decklist:decklistName'*/, modifyDeck)
app.delete('/api/decklist:decklistName', deleteDeck)

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`up on ${port}`))