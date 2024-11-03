const {Schema, model} = require('mongoose'); // Library database (MongoDB)

const marketEventSchema = new Schema({
    stockSymbol: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    impact: {
        type: Number,
        required: true
    },  // Dampak persentase terhadap harga saham
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = model('MarketEvent', marketEventSchema);