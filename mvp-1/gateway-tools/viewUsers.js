const Connection = require("../shared/mysql/Connection");
const UserModel = require("../shared/mysql/UserModel");
const User = UserModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            const users = await User.findAll({raw: true});
            console.log(users)
            process.exit();
        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });