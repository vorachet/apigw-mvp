require('dotenv').config({
    path: __dirname + "/../.env"
})
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router()

function generateAccessToken(username, role, expiresIn) {
    return jwt.sign({
            username: username,
            role: role
        },
        process.env.TOKEN_SECRET, {
            expiresIn: expiresIn
        }
    );
}

const Connection = require("../shared/mysql/Connection");
const UserModel = require("../shared/mysql/UserModel");
const User = UserModel(Connection);

Connection.authenticate()
    .then(() => {
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

router.post('/token', async (req, res) => {
    const authenticated = await User.findOne({
        where: {
            user: req.body.username,
            password: req.body.password
        }
    })
    const expiredIn =  req.body.expiresIn || '1m'
    const token = 
        authenticated ? 
        generateAccessToken(authenticated.user, authenticated.role, expiredIn) : 
        null 
    if (token) {
        res.send(token)
    } else {
        res.status(401)
        res.send('')
    }
    
})

module.exports = router