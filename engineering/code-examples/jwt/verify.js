require('dotenv').config({path: "../.env"});
const jwt = require('jsonwebtoken');

// use create.js to generate token

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNjI1NjMwMzEwLCJleHAiOjE2MjU2MzAzNzB9.U2fVcfmpPcZ33LQyEM8n403HFp-bqI540ZxgDg2OrNs";
jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    console.log(err ? err.message : 'token is valid')
  });
