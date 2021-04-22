const mongoose = require('mongoose')

// Add new fields to existing table
const postSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    visitedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = mongoose.model('Post', postSchema)