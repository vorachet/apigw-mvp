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

            const updatedUser = await User.update({
                note: 'updated note'
            }, {where: {
                user: 'james'
            }})

            console.log(`\nRESULT = ${updatedUser  ? "new user updated" : "unable to update new user"}`)

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });