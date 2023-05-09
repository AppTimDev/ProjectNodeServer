const express = require("express");
const router = express.Router();
const Notes = require('../models/Notes')
const {
    isMongoInit
} = require("../middleware/mongo");

// Getting all
router.get('/', [isMongoInit], async (req, res) => {
    console.log('get all notes');    
    try {
        const notes = await Notes.find()
        res.json(notes)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

// Getting One
router.get('/:id', getNote, (req, res) => {
    res.status(200).json(res.note)
})

// Creating one
router.post('/', async (req, res) => {
    const note = new Notes({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author ? req.body.author : "sys"
    })
    try {
        const newnote = await note.save()
        res.status(201).json(newnote)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

// Updating One
router.patch('/:id', getNote, async (req, res) => {
    if (!!req.body.title) {
        res.note.title = req.body.title
    }
    if (!!req.body.content) {
        res.note.content = req.body.content
    }
    try {
        res.json(await res.note.save())
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

// Deleting One
router.delete('/:id', getNote, async (req, res) => {
    try {
        await res.note.remove()
        res.json({
            message: 'Deleted note'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

//middleware
async function getNote(req, res, next) {
    let note
    try {
        note = await Notes.findById(req.params.id)
        if (note == null) {
            return res.status(404).json({
                message: 'Record is not found'
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
    res.note = note
    next()
}

module.exports = router