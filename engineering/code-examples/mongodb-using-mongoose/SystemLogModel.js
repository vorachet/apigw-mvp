module.exports = function (mongoose) {
    const {Schema} = mongoose;
    const schema = new Schema({
        publisher: {
            type: String,
            required: true,
            index: true
        },
        category: {
            type: String,
            required: true,
            index: true
        },
        event: {
            type: String,
            required: true,
            index: true
        },
        message: {
            type: String,
            required: false,
        }
    });
    return mongoose.model('SystemLogModel', schema);
}