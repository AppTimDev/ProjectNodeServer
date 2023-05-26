## A template project to use a node server

---

## Environment:
- Windows 10
- node 16.13.2
- npm 8.1.2
- nvm 1.1.7

- cross-env@7.0.3
- express@4.18.2
- pm2@5.2.2
- pm2-windows-service@0.2.1
- webpack-cli@4.10.0
- webpack@5.74.0

---

### Install the package globally
```cmd
npm i -g cross-env
npm i -g pm2
npm i -g pm2-windows-service
```
or
```cmd
npm i -g cross-env@7.0.3 
npm i -g pm2@5.2.2
npm i -g pm2-windows-service@0.2.1
```

### Install the package in devDependencies
```cmd
npm i --save-dev nodemon
npm i --save-dev swagger-ui-express
```

### Install the package in dependencies
```cmd
npm i --save express express-session cookie-parser dotenv  
npm i --save bcrypt jsonwebtoken
npm i --save mongoose
npm i --save redis amqplib
```

## Install nodemon
```cmd
npm i --save-dev nodemon
```

## node-inspector
npm i -g node-inspector  
For Node.js versions >=6.3 , just use the built-in node --inspect index.js
- To open the debug tool in chrome  
chrome://inspect

---

## PM2
```sh
npm i -g pm2  
cross-env NODE_ENV=production pm2 start server.js --env production  
cross-env NODE_ENV=production pm2 start server.js -i 4 --env production

pm2 save
pm2 startup
pm2 stop all
pm2 stop --help

pm2 kill
pm2 resurrect
pm2 status
pm2 stop
pm2 restart
pm2 delete
```

List all processes:  
pm2 list




## install pm2-windows-service (work)
1. Run the command in admin mode  
npm i -g pm2-windows-service   
pm2-service-install -n PM2  

2. Set PM2_HOME to a path that can be accessed.
C:\ProjectSoftware\.pm2

- uninstall  
pm2-service-uninstall -n PM2  
npm uninstall -g pm2-windows-service pm2  

### install pm2-installer
1. Go to <https://github.com/jessety/pm2-installer> 
2. Download the zip file and unzip to the path [install_path]
3. Run the install commands
```cmd
cd [install_path]
npm run configure
npm run configure-policy
npm run setup
```

## Using nssm and pm2_startup.bat (not restart auto)
1. Create your PM2 startup script which implements pm2 resurrect.
   Check out sample here(pm2_startup.bat)

2. As administrator, open command line, run:  
nssm.exe install PM2Service  
and set the following:  
Path: C:\Projects\ProjectNodeServer\pm2_startup.bat  
Folder: C:\Projects\ProjectNodeServer\  

Startup Type: Automatic delayed  
Restart: None **  
 
This will create a Windows Service called PM2Service   
(If you want to delete service, run: nssm.exe remove PM2Service)

---

## Install nvm for window users
1. Go to https://github.com/coreybutler/nvm-windows/releases

## Nvm Commands 
### Install the version for node
```cmd
nvm install 16.13.2
```
### Use the node version
```cmd
nvm use 16.13.2
```
### List the installed version of node and all latest versions.
```cmd
nvm list
nvm list available
```

---

## Commands 
### Check the version for node, npm, nvm
```cmd
node -v
npm -v
nvm version
```

### List all the node packages
```cmd
npm list 
npm list -g
```

### Check the version of node packages
```cmd
npm list express
npm info express version
```

---

# Vscode Rest Client
use requests.rest file to send request in vscode

---

## Install Mongo db in window

1. Go to https://www.mongodb.com/try/download/community and download

2. Edit Environment variable  
add the path C:\Program Files\MongoDB\Server\6.0\bin

### Check the version
```cmd
mongod --version
```
db version v6.0.3

For version 6, install mongosh
https://www.mongodb.com/try/download/shell

Using MongoDB:          6.0.3  
Using Mongosh:          1.6.0

## mongosh commands
```cmd
show dbs
use [dbname]
show collections
```

## Sample 
```cmd
use pms
db.createCollection("notes")

db.notes.insertOne({"title" : "my note title", "content" : "my note", "author": "AppTimDev"})
db.notes.find()
```

---

## Install Redis
1. Go to https://github.com/microsoftarchive/redis/releases and download


---

## RabbitMq
1. Edit the environment variable
C:\Program Files\RabbitMQ Server\rabbitmq_server-3.10.2\sbin

http://localhost:15672/

---

## Ports
| Application | Port|
|  ----  | ----  |
| MongoDb | 27017|
| Redis | 6379 |
| RabbitMq | 5672 |
| RabbitMq Web management | 15672 |

RabbitMq Web management  
http://serverip:15672  
http://localhost:15672

---

## swagger
Api document using swagger ui  
http://localhost:3000/doc