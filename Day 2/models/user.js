const {Schema, model} = require('mongoose'); // Library database (MongoDB)

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lastDaily: {
        type: Date,
        required: true,
        default: null,
    },
    portfolio: [
        {
            stockSymbol: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    transactionHistory: [
        {
            type: {
                type: String,
                enum: ['buy', 'sell'],
                required: true,
            },
            stockSymbol: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }
    ]
});

module.exports = model('User', userSchema);