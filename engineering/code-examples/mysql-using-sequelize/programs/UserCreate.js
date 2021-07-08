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
            const newUser = await User.create({
                user: 'user' + Date.now(),
                password: 'password',
                role: 'maintainer',
                note: 'first created'
            });
            console.log(`\nRESULT = ${newUser  ? "new user created" : "unable to create new user"}`)

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });