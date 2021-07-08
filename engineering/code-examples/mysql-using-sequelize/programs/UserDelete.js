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
            const deletedUser = await User.destroy({
                where: {
                    user: 'james'
                }
            })

            console.log(`\nRESULT = ${deletedUser  ? "new user deleted" : "unable to delete new user"}`)

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });