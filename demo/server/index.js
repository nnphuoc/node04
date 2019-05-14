'use strict';

import Express from 'express';
import FS from 'fs';
import Http  from 'http';
import bodyParser from 'body-parser' ;
import { port } from './config';
import models from './models';

models.connectDB()
    .then( console.log('connection db successfuly'))
    .catch(e=>{
        console.log(e);
        process.exit(1);
    });
const app = Express();

app
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json());

const router = Express.Router();
const routePath = `${__dirname}/routes/v1`;


// MongoClient.connect(url, function(err, client) {
    // Use the admin database for the operation
    // if (err) {
    //     console.log(err);
    //     process.exit(1);
    // }
    // const db = client.db(dbName);
    // List all the available databases
    // app.use((req, res, next) => {
    //     req.db = db;
    //     return next();
    // });
    FS.readdir(routePath, (e, fileNames) => {
        if (e) {
            console.error(e);
        } else {
            for (const fileName of fileNames) {
                require(`${routePath}/${fileName}`)(app, router);
            }
            app.use(router);
        }
    });
//   });

Http.createServer(app).listen(port, () => {
    console.log(`App listening on ${port}!`);
});