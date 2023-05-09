function isMongoInit(req, res, next) {
    //console.log(`process.env.MONGO_DB_INIT:  ${process.env.MONGO_DB_INIT}`);
    if(process.env.MONGO_DB_INIT === '1'){        
        next();
    }else{
        console.log('Mongo Db is not set up');        
        return res.status(500).send({
            message: 'Mongo Db is not set up'
        });
    }
}

module.exports = { isMongoInit };