'use strict';

import Express from 'express';
import FS from 'fs';
import Http  from 'http';
import bodyParser from 'body-parser' ;
import { port } from './config';
import models from './models';
import I18N from 'i18n';
import Response from './helpers/response';
const app = Express();
const server = Http.Server(app);
const io = require('socket.io')(server);

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

app.use(I18N.init)
    .use(bodyParser.urlencoded({ extended: false }))
    .use(Express.static(__dirname + '/public'))
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

io.on('connection', function (socket) {
    console.log('user connect');
    socket.on('recieving-message', (data, callback)=> {
        try {
            socket.broadcast.emit('send-message-from-server', data);
            return callback(null, data);
        } catch (e) {
            return callback(e);
        }
    });
    socket.on('typing', (data, callback)=>{
        try {
            socket.broadcast.emit('server-typing', data);
        } catch (e) {
            return callback(e);
        }
    });
    socket.on('stop-typing', (data, callback)=>{
        try {
            socket.broadcast.emit('server-stop-typing', data);
        } catch (e) {
            return callback(e);
        }
    });
    socket.on('disconnect', function () {
        console.log('user disconnect');
    })
});

server.listen(port, () => {
    console.log(`App listening on ${port}!`);
});