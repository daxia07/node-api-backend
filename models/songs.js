const mongoose = require('mongoose')

// Add new fields to existing table
const songSchema = new mongoose.Schema({
    album: {
        type: String,
        required: true
    },
    singer: {
        type: String
    },
    musicSrc: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
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
    totalDuration: {
        type: Number,
        default: 0
    },
    fileId: {
        type: String,
        required: true
    },
    cover: {
        type: String
    }
})

module.exports = mongoose.model('Song', songSchema)