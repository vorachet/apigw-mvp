const Connection = require("../shared/mysql/Connection");
const UserModel = require("../shared/mysql/UserModel");
const User = UserModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            await Connection.sync({
                force: true
            });
            const creation = await User.bulkCreate([{
                    user: 'admin1',
                    password: 'password',
                    role: 'admin',
                    note: 'first created'
                },
                {
                    user: 'admin2',
                    password: 'password',
                    role: 'admin',
                    note: 'first created'
                },
                {
                    user: 'ma1',
                    password: 'password',
                    role: 'maintainer',
                    note: 'first created'
                },
                {
                    user: 'ma2',
                    password: 'password',
                    role: 'maintainer',
                    note: 'first created'
                }
            ]);

            console.log(creation.length == 4 ? 'Done' : 'Unable to perform bulk create')

            process.exit();

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });