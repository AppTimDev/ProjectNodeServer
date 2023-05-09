const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    console.log("server:testing success!");
    res.send({
        ok: 1,
        message: 'testing'
    });
});

router.post("/", (req, res) => {
    console.log(req.body);
    res.send({
        ok: 1,
        message: 'testing'
    });
});

router.get("/cookie", (req, res) => {
    console.log(`cookies: ${JSON.stringify(req.cookies)}`);
    console.log(`version: ${req.cookies?.version}`);
    //httpOnly, expires, maxAge, signed
    res.cookie('version', 'v2', {
        httpOnly: true,
        maxAge: 600000, //10 min
        signed: false
    })
    res.status(200).json({
        ok: 1,
        message: 'testing cookie'
    });
});

router.get("/session", (req, res) => {
    //console.log(`cookies: ${JSON.stringify(req.cookies)}`);
    console.log(`session username: ${req.session.username}`);
    console.log(`cookie sid:  ${req.cookies?.sid}`);
    console.log(req.session)
    console.log(req.sessionID)

    req.session.username = "Tim:" + req.sessionID
    res.cookie('version', 'v2', {
        httpOnly: true,
        maxAge: 600000, //10 min
        signed: false
    })
    res.status(200).json({
        ok: 1,
        message: 'testing session',
        cookies_sid: req.cookies ?.sid,
        session: req.session,
        sid: req.sessionID
    });
})

router.get("/token", (req, res) => {
    //test jwt token
    try {
        const authHeader = req.headers['authorization']
        console.log(`authHeader:  ${authHeader}`);
        const token = authHeader && authHeader.split(' ')[1]
        console.log(`process.env.ACCESS_TOKEN_SECRET_KEY: ${process.env.ACCESS_TOKEN_SECRET_KEY}`);

        if (!token) {
            //no token create a new one
            const token = jwt.sign({
                name: "tim",
                roles: ["admin"]
            }, process.env.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: "15s"
            });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 20000, //20s
                signed: false
            })
            res.status(200).json({
                ok: 1,
                message: 'Create new token',
                token: token
            });
        } else {
            //verify the token
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
                if (err) {
                    //console.log(err)
                    return res.status(403).send({
                        ok: 0,
                        error: "Access denied. Token expired"
                    })
                }
                req.user = user
                console.log(user);
                return res.status(200).send({
                    ok: 1,
                    user: user
                })
            })
        }

    } catch (error) {
        return res.status(401).send({
            ok: 0,
            error: "Invalid Request"
        })
    }
});

router.post("/bcrypt/hash", async (req, res) => {
    try {
        const password = req.body.password ?.toString()
        const salt = await bcrypt.genSalt(15);
        let hash = ""
        if (password) {
            console.log(`string to be hashed: ${password}`);
            console.log(`salt: ${salt}`);
            hash = await bcrypt.hash(password, salt)
            console.log(`hash: ${hash}`);
        }
        return res.status(200).send({
            ok: 1,
            salt: salt,
            hash: hash
        })
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            ok: 0,
            error: "Bad Request"
        })
    }
});

router.post("/bcrypt/verify", async (req, res) => {
    try {
        const password = req.body.password ?.toString()
        if (password) {
            const userPasswordTesting = "$2b$15$QDazH2xbqUDQzKbO5tRaPO4VO1snBUyBtsyl3iXn7z2La.OtAITBW"
            const isValid = await bcrypt.compare(password, userPasswordTesting)
            if (isValid) {
                return res.status(200).send({
                    ok: 1,
                    message: 'Correct Password',
                    isValidPassword: isValid
                })
            } else {
                return res.status(200).send({
                    ok: 1,
                    message: 'Incorrect Password',
                    isValidPassword: isValid
                })
            }
        } else {
            return res.status(400).send({
                ok: 0,
                error: "No password provided"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            ok: 0,
            error: "Bad Request"
        })
    }
});


router.get("/redis/:key", async (req, res) => {
    try {
        console.log('redis get value key: ', req.params.key);        
        if (global.redis) {
            const val = await global.redis.get(req.params.key)
            res.status(200).json({
                ok: 1,
                message: 'testing redis get',
                key: req.params.key,
                value: val
            });
        }else{
            return res.status(500).send({
                ok: 0,
                message: 'Redis client is not set up'
            });
        }
    } catch (err) {
        res.status(500).json({
            ok: 0,
            error: 'Redis server error'
        });
    }
});

router.post("/redis", async (req, res) => {
    try {
        if(!req.body.key | !req.body.value){
            return res.status(400).send({
                ok: 0,
                message: 'Bad Request: Invalid key value pairs'
            });
        }
        console.log(`redis set  key: ${req.body.key}, value: ${req.body.value}`);        
        if (global.redis) {
            const result = await global.redis.set(req.body.key, req.body.value)
            res.status(200).json({
                ok: 1,
                message: 'testing redis set',
                key: req.body.key,
                value: req.body.value,
                res: result
            });
        }else{
            return res.status(500).send({
                ok: 0,
                message: 'Redis client is not set up'
            });
        }
    } catch (err) {
        res.status(500).json({
            ok: 0,
            error: 'Redis server error'
        });
    }
});

router.post("/rabbitmq/send", async (req, res) => {
    try {
        if(!req.body.data){
            return res.status(400).send({
                ok: 0,
                message: 'Bad Request: Invalid format of data'
            });
        }         
        if (global.RabbitMq) {
            console.log(`rabbitmq data send: `, req.body.data);
            const result = await global.RabbitMq.send(req.body.data)
            res.status(200).json({
                ok: 1,
                message: 'testing rabbitmq send data',
                data: req.body.data,
                result: result
            });
        }else{
            return res.status(500).send({
                ok: 0,
                message: 'Rabbitmq is not set up'
            });
        }
    } catch (err) {
        console.error(err);        
        res.status(500).json({
            ok: 0,
            error: 'Rabbitmq server error'
        });
    }
});


module.exports = router;