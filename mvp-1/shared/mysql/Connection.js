require('dotenv').config({
    path: __dirname + "/../../.env"
})

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    port: 53306,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

module.exports = sequelize