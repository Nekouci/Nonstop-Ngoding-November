const {Schema, model} = require('mongoose'); // Library database (MongoDB)

const stockSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    previousClose: {
        type: Number,
        required: true
    },
    sector: {
        type: String,
        required: true,
        default: 'Miscellaneous'
    },
    volatility: {
        type: Number,
        required: true,
        default: 0.5
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    priceHistory: [
        {
            price: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = model('Stock', stockSchema);