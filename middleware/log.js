function logPosts(req, res, next) {
    console.log(`logPosts:`);
    console.log(`${req.method} ${req.url}`);
    //console.log(`body: ${req.body}`);
    console.log(`title: ${req.body.title}`);
    console.log(`content: ${req.body.content}`);
    
    //if(req.query)
    console.log(req.query);    
    console.log(`query id: ${req.query?.id}`);
    console.log(`------------------------------------------------------------------------------------`);

    next();
}

module.exports = { logPosts };