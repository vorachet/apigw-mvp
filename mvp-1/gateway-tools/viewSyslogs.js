const Connection = require("../shared/mongodb/Connection");
const SystemLogModel = require("../shared/mongodb/SystemLogModel");
const SystemLog = SystemLogModel(Connection);

(async () => {
    const data = await SystemLog.find().exec()
    console.log(data)
    process.exit();
})();

