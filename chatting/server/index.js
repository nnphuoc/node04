'use strict';

import Express from 'express';
import FS from 'fs';
import Http  from 'http';
import bodyParser from 'body-parser' ;
import { port } from './config';
import models from './models';
import I18N from 'i18n';
import Response from './helpers/response';

I18N.configure({
    locales: ['en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    autoReload: true,
    updateFiles: false
});

models.connectDB()
    .then( console.log('connection db successfuly'))
    .catch(e=>{
        console.log(e);
        process.exit(1);
    });
const app = Express();

app.use(I18N.init)
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
        app.use(router);
        app.use((e, req, res, next) => {
            return Response.error(res, e);
        });
    }
});

Http.createServer(app).listen(port, () => {
    console.log(`App listening on ${port}!`);
});