require('dotenv').config({path: "../.env"});
const jwt = require('jsonwebtoken');

function generateAccessToken(username, expiresIn) {
    return jwt.sign(
        { username: username},
        process.env.TOKEN_SECRET,
        { expiresIn: expiresIn }
    );
}

console.log(generateAccessToken("1muser", "1m"))
console.log(generateAccessToken("1duser", "1d"))
console.log(generateAccessToken("1duser", "1000d"))