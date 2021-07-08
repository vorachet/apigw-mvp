require('dotenv').config({
    path: __dirname + "/../../.env"
})

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:57017/${process.env.DB}`, {
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-256',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true
});

module.exports = mongoose