const express = require("express");
const {
    logPosts
} = require("../middleware/log");
const {validatePost} = require("../middleware/validate");
const router = express.Router();

// Test data
let posts = [{
    id: 1,
    title: "Title 1",
    content: "Content 1"
}];
let gId = 1;

router.get("/", [logPosts], (req, res) => {
    if (req.query.id) {
        const result = posts.filter((p) => {
            return p.id.toString() === req.query.id
        });
        return res.send({
            ok: 1,
            result: result
        });
    }
    res.send({
        ok: 1,
        result: posts
    });
});

//validate the parameter id
router.param('id', validatePost);

//path: /post/:id
router.get("/:id", [logPosts], (req, res) => {
    console.log(`params id: ${req.params.id}`);
    if (req.params.id) {
        const result = posts.filter((p) => {
            return p.id.toString() === req.params.id
        });
        return res.send({
            ok: 1,
            result: result
        });
    }
    res.send({
        ok: 1,
        result: posts
    });
});

router.post("/", [logPosts], async (req, res) => {
    posts.push({
        id: gId + 1,
        title: req.body.title,
        content: req.body.content
    });
    gId += 1

    res.status(200).send({
        ok: 1,
        result: posts
    });
});

router.put("/", [logPosts], async (req, res) => {
    posts = posts.map((p) => {
        if (p.id === req.body.id) {
            return {
                id: req.body.id,
                title: req.body.title,
                content: req.body.content
            }
        } else {
            return p;
        }
    });

    res.status(200).send({
        ok: 1,
        result: posts
    });
});

router.delete("/", [logPosts], async (req, res) => {
    posts = posts.filter((p) => {
        return p.id !== req.body.id
    });

    res.status(200).send({
        ok: 1,
        result: posts
    });
});

module.exports = router;