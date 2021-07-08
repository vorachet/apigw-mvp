const Connection = require("../Connection");
const InventoryModel = require("../InventoryModel");
const Inventory = InventoryModel(Connection);

const newInventory = new Inventory({
    category: "drink",
    name: `product-${Date.now()}`,
    quantity: 100,
    price: 20,
    note: "imported from Thailand"
});

(async () => {
    const result = await newInventory.save();
    console.log(result ? 'created' : 'unable to create')
    process.exit()
})();