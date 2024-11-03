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
});

module.exports = model('User', userSchema);