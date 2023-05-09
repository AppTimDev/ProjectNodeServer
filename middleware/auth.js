const jwt = require('jsonwebtoken')

function authPassword(req, res, next) {
    console.log(`authPassword:`);

    const users = [{
        name: "tim",
        password: "123"
    }];
    let user = users.find(u => u.name === req.body.name);
    if (!user) {
        //throw new Error("Invalid user or password");
        return res.status(401).send({
            ok: 0,
            error: "Invalid user or password"
        });
    }


    //change 
    const valid = req.body.password === user.password
    if (!valid) return res.status(401).send({
        ok: 0,
        error: "Invalid user or password"
    });

    //user name or password not correct
    //below codes will not be exexcuted
    console.log(req.body.name);
    console.log(req.body.password);

    req.isPasswordValid = true
    next();
}

function authToken(req, res, next) {
    // authenticate access token
    // Header
    // Authorization: Bearer [token]
    try {
        const authHeader = req.headers['authorization']
        //console.log(`authHeader:  ${authHeader}`);        
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).send({
            ok: 0,
            error: "Access denied. No token provided"
        })
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
            //console.log(err)
            if (err) return res.status(403).send({
                ok: 0,
                error: "Access denied. Token expired"
            })
            req.user = user
            
            next()
        })
    } catch (error) {
        return res.status(401).send({
            ok: 0,
            error: "Access denied. Invalid token"
        })
    }
}

module.exports = {
    authPassword,
    authToken
};