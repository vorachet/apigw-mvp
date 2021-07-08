const Connection = require("../shared/mysql/Connection");
const InventoryModel = require("../shared/mysql/InventoryModel");
const Inventory = InventoryModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            await Connection.sync({
                force: true
            });

            const creation = await Inventory.bulkCreate([{
                    category: 'drink',
                    name: 'Orange juice',
                    quantity: 200,
                    price: 15,
                    note: ''
                }, {
                    category: 'eletronic',
                    name: 'iPhone',
                    quantity: 13,
                    price: 30000,
                    note: ''
                }, {
                    category: 'car',
                    name: 'Tasla  Model S',
                    quantity: 10,
                    price: 45000000,
                    note: ''
                }, {
                    category: 'ticket',
                    name: 'Unlimited La Liga 2021-2040',
                    quantity: 200,
                    price: 99999999999,
                    note: ''
                },
                
            ]);

            console.log(creation.length == 4 ? 'Done' : 'Unable to perform bulk create')

            process.exit();

        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });