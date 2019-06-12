import message from './message';
import group from './group';
import { JWTHelper } from '../helpers'

exports.initializeConnection = function (io) {
    io.use( async function (socket, next) {
       try {
           const token = socket.handshake.query.token;
           const data = await JWTHelper.verifyToken(token);
           socket.user = data.id;
           return next();
       } catch (e) {
           return next(e);
       }
    });
    io.on('connection', function (socket) {
        socket.on('create', function(room) {
            socket.join(room);
            // console.log(socket);
            message.messageInit(socket);
            group.messageInit(socket);
        });
        socket.on('disconnect', function () {
            console.log('user disconnect');
        });
    });
};