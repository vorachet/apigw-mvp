require('dotenv').config({
    path: __dirname + "/../.env"
})
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const proxy = require('./proxy')

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

function generateAccessToken(username, expiresIn) {
    return jwt.sign({
            username: username
        },
        process.env.TOKEN_SECRET, {
            expiresIn: expiresIn
        }
    );
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenInfo) => {
        req.tokenInfo = tokenInfo
        if (err) return res.sendStatus(403)
        next()
    })
}

app.get('/', (req, res) => {
    res.send("Gateway OK")
})

app.post('/token', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const expiresIn = req.body.expiresIn || '1d'
    if (username === 'user' && password === 'password') {
        res.send(generateAccessToken(username, expiresIn))
    } else {
        res.status(401);
        res.send('Unable to generate token')
    }
})

app.get('/secured', authenticateToken, (req, res) => {
    console.log(req.tokenInfo)
    res.json(req.tokenInfo)
})

// Adding new microservice instances here
const mvcInstances = [{
    instance: proxy('http://localhost:3001'),
    paths: [{
        gwPath: '/mcv1',
        mcvPath: '/'
    }],
    tokenRequiredPaths: [{
        gwPath: '/secured-mcv1',
        mcvPath: '/secured'
    }]
}, {
    instance: proxy('http://localhost:3002'),
    paths: [{
        gwPath: '/mcv2',
        mcvPath: '/'
    }],
    tokenRequiredPaths: [{
        gwPath: '/secured-mcv2',
        mcvPath: '/secured'
    }]
}]

mvcInstances.map(inst=> {
    inst.paths.map(path=> {
        app.get(path.gwPath, (req, res) => {
            inst.instance.get(path.mcvPath).then(resp => {
                res.send(resp.data)
            }).catch(error => {
                res.status(401)
                res.send('')
            });
        })
    })
    inst.tokenRequiredPaths.map(path=> {
        app.get(path.gwPath, (req, res) => {
            let config = {
                headers: req.headers
            }
            inst.instance.get(path.mcvPath, config).then(resp => {
                res.send(resp.data)
            }).catch(error => {
                res.status(401)
                res.send('')
            });
        })
    })
})

// required by multiple jest/supertest tests 
if (process.env.NODE_ENV !== 'test') {
    app.listen(3000);
    console.log("gateway http://localhost:3000")
}

module.exports = app