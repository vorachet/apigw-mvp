const { DataTypes} = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define('Inventory', {
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        price: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: false
        }
    }, {
        indexes: [{
            unique: false,
            fields: ['category', 'name']
        }]

    })
};