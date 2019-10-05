// https://bit.ly/2KQb0gR

const express = require('express')
const pokemonsRouter = require('./pokemons/router')
const app = express()

app.use(express.json())

// Register router
app.use(pokemonsRouter)

module.exports = app