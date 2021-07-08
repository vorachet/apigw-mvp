const Connection = require("../Connection");
const UserModel = require("../UserModel");
const User = UserModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            await Connection.sync({
                force: true
            });
            const creation = await User.bulkCreate([{
                    user: 'james',
                    password: 'password',
                    role: 'admin',
                    note: 'first created'
                },
                {
                    user: 'Joe',
                    password: 'password',
                    role: 'admin',
                    note: 'first created'
                },
                {
                    user: 'vorachet',
                    password: 'password',
                    role: 'maintainer',
                    note: 'first created'
                },
                {
                    user: 'Ranar',
                    password: 'password',
                    role: 'maintainer',
                    note: 'first created'
                }
            ]);

            console.log(creation.length == 4 ? 'Done' : 'Unable to perform bulk create')

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });