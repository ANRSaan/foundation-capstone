require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {seed, getDeck, createUser, createDeck, deleteCards, addCards, deleteDeck, deleteUser, getCards, getIdentities, getEvents, getPrograms, getHardware, getResources} = require('./controller.js')

app.use(express.json())
app.use(cors())

//seed the database
app.post('/api/seed', seed)

//cards
app.get('/api/cards', getCards)
app.get('/api/cards/identities', getIdentities)
app.get('/api/cards/events', getEvents)
app.get('/api/cards/programs', getPrograms)
app.get('/api/cards/hardware', getHardware)
app.get('/api/cards/resources', getResources)

//users
app.post('/api/users', createUser)
app.delete('/api/users/:userName', deleteUser)

//decklists
app.get('/api/decklist', getDeck)
app.post('/api/decklist', createDeck)
app.post('/api/decklist/card', addCards)
app.delete('/api/decklists/card/:cardName', deleteCards)
app.delete('/api/decklist/:deckName', deleteDeck)

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`up on ${port}`))