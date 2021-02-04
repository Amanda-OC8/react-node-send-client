const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 1
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});


const Link = mongoose.model('Link', LinkSchema)
module.exports = Link