require('dotenv').config({
    path: __dirname + "/.env"
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
        if (err) return res.sendStatus(403)
        res.tokenInfo = tokenInfo
        next()
    })
}
app.get('/', (req, res) => {
    res.send('mcv2 OK')
})

app.get('/secured', authenticateToken, (req, res) => {
    console.log(res.tokenInfo)
    res.json(res.tokenInfo)
})

// required by multiple jest/supertest tests 
if (process.env.NODE_ENV !== 'test') {
    app.listen(3002);
    console.log("mcv2 http://localhost:3002")
}

module.exports = app