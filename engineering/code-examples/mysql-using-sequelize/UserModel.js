const { DataTypes} = require("sequelize");

module.exports = function(sequelize){
    return sequelize.define('User', {
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(64),
            is: /^[0-9a-f]{64}$/i
        },
        role: {
            type: DataTypes.STRING,
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
            fields: ['user','password']
        },{
            unique: false,
            fields: ['role']
        }]

    })
};