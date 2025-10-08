const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        likedItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }],
        savedItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }],
        cart: [{
            foodItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);