const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path');
const mongoose = require('mongoose')
const app = express();
const {
    config,
    webApp,
    webAppReact
} = require('./config');
const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
    //path default: path.resolve(process.cwd(), '.env')
    require('dotenv').config({
        path: path.resolve(process.cwd(), '.env.production')
    })
} else {
    require('dotenv').config()
}

//import routes
const postRouter = require("./routes/post");
const sysRouter = require("./routes/sys");
const userRouter = require("./routes/user");
const testRouter = require("./routes/test");
const notesRouter = require("./routes/notes");

const ApiUrl = (link) => {
    return api_url + link;
}

console.log(`Server mode: ${process.env.NODE_ENV}`);
console.log(`DOTENV_ENV: ${process.env.DOTENV_ENV}`);
if(process.env.PM2_VERSION){
    console.log(`process.env.PM2_VERSION: ${process.env.PM2_VERSION}`);
}else{
    console.log(`pm2 is not using!`);
}

const CONFIG = isProduction ? config.production : config.development
const {
    port,
    api_url,
} = CONFIG

if(!isProduction){
    console.log(`API URL: http://localhost:${port}${api_url}`);
}


//redis init
if (process.env.ALLOW_REDIS == '1') {
    const redis = require('redis');
    const redisClient = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    });
    global.redis = redisClient

    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err)
        //client.disconnect()
    });
    redisClient.on('end', (err) => {
        console.log('Redis Client end')
    });
    redisClient.on('ready', (err) => {
        console.log('Redis Client is ready')
    });
    redisClient.on('reconnecting', (err) => {
        console.log('Redis Client is reconnecting')
    });

    (async () => {
        try {
            await redisClient.connect()
            console.log('Redis server is connected');
        } catch (e) {
            console.log(`Redis server error: ${e}`);
        }
    })()
}

//rabbit mq init
if (process.env.ALLOW_RABBIT_MQ == '1') {
    const amqp = require("amqplib");
    (async () => {
        try {
            //conn = await amqp.connect(process.env.RABBIT_MQ_URL);
            const queueName = process.env.RABBIT_MQ_QUEUE_NAME
            conn = await amqp.connect({
                hostname: process.env.RABBIT_MQ_HOST,
                port: process.env.RABBIT_MQ_PORT,
                username: process.env.RABBIT_MQ_USERNAME,
                password: process.env.RABBIT_MQ_PASSWORD
            });
            channel = await conn.createChannel()
            await channel.assertQueue(queueName)

            global.RabbitMq = {
                channel: channel,
                send: function(data){
                    //console.log(typeof(data));                    
                    if(typeof(data)==='object') data = JSON.stringify(data)
                    return channel.sendToQueue(queueName, Buffer.from(data));
                }
            }
            console.log(`RabbitMq is connected successfully.`);      

            // Listener            
            channel.consume(queueName, msg => {
                const result = JSON.parse(msg.content.toString())
                console.log('Consume:');        
                console.log(result);
                        
                channel.ack(msg);
            })

        } catch (err) {
            console.log(`RabbitMq server error: ${err}`);
            global.RabbitMq = null
        } 
    })();
}

//mongo db init
if (process.env.ALLOW_MONGO == '1') {
    mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true
    })
    const mongoDb = mongoose.connection
    mongoDb.on('error', (err) => console.error(err))
    mongoDb.once('open', () => {
        console.log('Connected to Mongo DB')
        process.env.MONGO_DB_INIT = '1' //string
    })
}


// Import all middlewares
// support parsing of application/json type post data, 
// get req.body
app.use(express.json({
    limit: "100mb"
}));
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
/*
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
*/
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

//cors development only
//not in production
if (!isProduction) {
    let allowCrossDomain = function (req, res, next) {
        //console.log('allowCrossDomain');
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Headers', "*");
        next();
    }
    app.use(allowCrossDomain);

    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swagger.json');
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Swagger api doc: http://localhost:${port}/doc`);    
}

// app.post(ApiUrl('/login'), function (req, res) {
//     //res.redirect('/');
//     console.log(ApiUrl('/login'));

//     const json = {
//         ok: 1,
//         status: 301,
//         url: '/'
//     }
//     //console.log(json);

//     return res.json(json)
// });

app.get(ApiUrl('/'), function (req, res) {
    res.send("ok");
});

// Setup all the routers
app.use(ApiUrl('/post'), postRouter);
app.use(ApiUrl('/notes'), notesRouter);
app.use(ApiUrl('/sys'), sysRouter);
app.use(ApiUrl('/user'), userRouter);
app.use(ApiUrl('/test'), testRouter);

//static files
app.use('/', express.static(path.join(webApp.src)))
app.use('/react', express.static(path.join(webAppReact.src)))
// app.get('/react/*', function (req, res) {
//     res.sendFile(path.join(reactApp.src, 'index.html'), function (err) {
//         if (err) {
//             res.status(500).send(err)
//         }
//     })
// })

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
    if (!isProduction) {
        console.log(`Url:`);
        console.log(`http://localhost:${port}`);
        console.log(`http://localhost:${port}/react`);
    }    
})