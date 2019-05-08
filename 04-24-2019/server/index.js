'use strict';

import Express from 'express';
import FS from 'fs';
import Http  from 'http';
import bodyParser from 'body-parser' ;
import {port} from './config';

const app = Express();

app
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json());

const router = Express.Router();
const routePath = `${__dirname}/routes/v1`;
FS.readdir(routePath, (e, fileNames) => {
    if (e) {
        console.error(e);
    } else {
        for (const fileName of fileNames) {
            require(`${routePath}/${fileName}`)(app, router);
        }
        app.get('/favicon.ico', (req, res) => res.status(204));
        app.use(router);
    }
});

Http.createServer(app).listen(port, () => {
    console.log(`App listening on ${port}!`);
});