const { Op } = require("sequelize");
const Connection = require("../Connection");
const UserModel = require("../UserModel");
const User = UserModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            await Connection.sync({
                force: false
            });
            const keyword = 'j'
            const matchedUsers = await User.findAll({
                where: {
                    user: {
                        [Op.like]: '%' + keyword + '%'
                    }
                }
            })
            console.log("matchedUsers")
            matchedUsers.map(user => {
                console.log(`\t${user.user}(${user.role})`)
            }).join('\r\n')
        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });