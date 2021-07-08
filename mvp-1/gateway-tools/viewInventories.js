const Connection = require("../shared/mysql/Connection");
const InventoryModel = require("../shared/mysql/InventoryModel");
const Inventory = InventoryModel(Connection);

Connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        (async () => {
            const inventories = await Inventory.findAll({raw: true});
            console.log(inventories)
            process.exit();
        })();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });