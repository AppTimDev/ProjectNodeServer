const express = require("express");
const router = express.Router();
const {
    execCmd
} = require("../common/command");

router.get("/dir", (req, res) => {
    execCmd('dir')
    res.send({
        ok: 1,
        message: 'Displays a list of files and subdirectories in a directory.'
    });
});

router.get("/test", (req, res) => {
    execCmd('dir')
    res.send({
        ok: 1,
        message: 'test'
    });
});

router.get("/shutdown", (req, res) => {
    execCmd('shutdown /s /t 5 /f')
    res.send({
        ok: 1,
        message: 'Shut down computer'
    });
});

module.exports = router;