const express = require("express");
const {
    authPassword
} = require("../middleware/auth");
const router = express.Router();



router.post("/login", [authPassword], (req, res) => {

    //correct user
    console.log(`req.isPasswordValid:${req.isPasswordValid}`);

    

    res.status(200).send({
        ok: 1,
        redirect:1,
        path: '/'
    });
});

router.post("/logout", (req, res) => {
    //clear cookie
    res.clearCookie('token')

    return res.status(200).send({
        ok: 1,
        redirect:1,
        path: '/'
    });
});


module.exports = router;