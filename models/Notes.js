const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    // star: {
    //     type: Number,
    //     required: false
    // },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', notesSchema)