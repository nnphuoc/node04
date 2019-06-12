import messageController from '../controllers/message';
exports.messageInit = function (socket) {
    socket.on('message', async (data, callback)=> {
        try {
            const action = data.action;
            switch (action) {
                case 'typing':
                    socket.broadcast.to(data.group).emit('message', { action: 'typing', message: data.message });
                    callback(null, data);
                    break;
                case 'stop-typing':
                    socket.broadcast.to(data.group).emit('message', { action: 'stop-typing' });
                    callback(null, data);
                    break;
                case 'seen':
                    socket.broadcast.to(data.group).emit('message', { action: 'seen' });
                    callback(null, data);
                    break;
                case 'receiving':
                    socket.broadcast.to(data.group).emit('message', { action: 'server-send', message: data.message });
                    await messageController.create(
                        { body: {
                                content: data.message,
                                author: socket.user,
                                group: data.newGroup
                            }}
                        );
                    callback(null, data);
                default:
                    break
            }
        } catch (e) {
            return callback(e);
        }
    });
}