require('dotenv').config({
    path: __dirname + "/../.env"
})
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose');

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

const Connection = require("../shared/mongodb/Connection");
const SystemLogModel = require("../shared/mongodb/SystemLogModel");
const SystemLog = SystemLogModel(Connection);

app.get('/', (req, res) => {
    res.send('syslog OK')
})

app.get('/syslogs', authenticateToken, async (req, res) => {
    const data = await SystemLog.find().exec()
    console.log("GET /syslogs", data)
    res.json(data)
})

app.get('/syslog/:publisher', authenticateToken, async (req, res) => {
    const data = await SystemLog.find({
        publisher: req.params.publisher
    }).exec()
    console.log(`GET /syslog/${req.params.publisher}`, data)
    res.json(data)
})

app.post('/syslog', authenticateToken, async (req, res) => {
    const newSystemLog = new SystemLog({
        publisher: req.body.publisher,
        category: req.body.category,
        event: req.body.event,
        message: req.body.message,
    });

    const result = await newSystemLog.save();
    console.log(`POST /syslog`, result ? 'created' : 'unable to create')
    if (result) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
})


// required by multiple jest/supertest tests 
if (process.env.NODE_ENV !== 'test') {
    app.listen(3002);
    console.log("mcv1 http://localhost:3002")
}

module.exports = app