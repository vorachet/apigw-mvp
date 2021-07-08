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
            const admins = await User.findAll({
                where: {role: 'admin'}
            })
            console.log(`\nRESULT: Found admins (${admins.length})\n`, admins.map(a => a.user))

            const maintainers = await User.findAll({
                where: {role: 'maintainer'}
            })
            console.log(`\nRESULT: Found maintainers (${maintainers.length})`, maintainers.map(a => a.user))

            const login = await User.findOne({
                where: {
                    user: 'james',
                    password: "passwords"
                }
            })
            console.log(`\nRESULT: login" ${login ? 'James successfully verified username & password' : 'wrong user'}\n`)

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });