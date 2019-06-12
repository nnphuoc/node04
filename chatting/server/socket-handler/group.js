exports.messageInit = function (socket) {
    socket.on('group', (data, callback)=> {
        try {
            const action = data.action;
            switch (action) {
                case 1:
                    socket.broadcast.emit('send-message-from-server', data);
                    return callback(null, data);
                    break;
                default:
                    break
            }

        } catch (e) {
            return callback(e);
        }
    });
}