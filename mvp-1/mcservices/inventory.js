require('dotenv').config({
    path: __dirname + "/../.env"
})
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenInfo) => {
        if (err) return res.sendStatus(401)
        res.tokenInfo = tokenInfo
        next()
    })
}

const Connection = require("../shared/mysql/Connection");
const InventoryModel = require("../shared/mysql/InventoryModel");
const Inventory = InventoryModel(Connection);

app.get('/', (req, res) => {
    res.send('inventory OK')
})

app.get('/inventories', authenticateToken, async (req, res) => {
    const data = await Inventory.findAll({raw: true})
    console.log("inventories", data)
    res.json(data)
})

app.get('/inventory/:id', authenticateToken, async (req, res) => {
    const data = await Inventory.findOne({raw: true, where: {
        id: req.params.id
    }})
    console.log(`inventory/${req.params.id}`, data)
    res.json(data)
})

// required by multiple jest/supertest tests 
if (process.env.NODE_ENV !== 'test') {
    app.listen(3001);
    console.log("mcv1 http://localhost:3001")
}

module.exports = app