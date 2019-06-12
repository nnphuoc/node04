const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnsiX2lkIjoiNWNlYzhmODlhNzIzY2YxNzY5NGEyODhlIn0sImlhdCI6MTU1OTkxODg1NCwiZXhwIjoxNTY2Mzk4ODU0fQ.FgwYpqAkDRP71YwS49y3VlSbvYXhbILuGUXzy4DEat2GL3wopj3nAsb8K4VSeehl7o23FZ9lIiZzOc9_McwnzyoKqr6vtNpUPExcCEtbqjiwK6zkHI3pbxTeV24BCzPvDf5AMWKMsRSOcrglOxjUzm4pIVVk7GrITZjHGJ2p-as';
let group;
const user = '5cec8f89a723cf17694a288e';
const promiseGroup = new Promise((resolve, reject)=>{
    const result = $.ajax({
        url: '/groups',
        type: 'GET',
        // Fetch the stored token from localStorage and set in the header
        headers: {'Authorization': 'Bearer '+ token}
    });
    if (!result.success) {
        return reject(result);
    }
        return resolve(result);
});
function promiseMessage() {
    return new Promise((resolve, reject)=>{
        const result = $.ajax({
            url: '/messages/group/' +  group,
            type: 'GET',
            // Fetch the stored token from localStorage and set in the header
            headers: {'Authorization': 'Bearer '+ token}
        });
        if (!result.success) {
            return reject(result);
        }
        return resolve(result);
    });
}
function getListMessage(id) {
    group = id;
    promiseMessage().then(messages=> {
        console.log(messages);
        const socket = io('http://localhost:5555', {
            query: 'token='+ token
        });
        socket.emit('create', group);
        let typing = false;
        let timeout;
        socket.on('message', function (data) {
            const action = data.action;
            const time = new Date();
            switch (action) {
                case 'typing':
                    $('.typing').remove();
                    $('#messages').append(`
                        <div class="message typing">
                            <p>${data.message}</p>
                            <span>${time.getHours()}:${time.getMinutes()}</span>
                        </div>
                   `);
                    break;
                case 'stop-typing':
                    $('.typing').remove();
                    break;
                case 'seen':
                    $('.message span').html('Đã xem lúc '+ time.getHours()+':'+time.getMinutes());
                    break;
                case 'server-send':
                    $('.typing').remove();
                    $('.message span').remove();
                    $('#messages').append(`
                        <div class="message">
                            <p>${data.message}</p>
                            <span>${time.getHours()}:${time.getMinutes()}</span>
                        </div>
                   `);
                    break;
                default:
                    break;
            }
        });
        function timeOutSend() {
            typing = false;
            socket.emit('message', {
                action: 'typing',
                message: '...'
            }, (err) => {
                if (err) {
                    return alert('err');
                }
            });
        }
        $('#messages').click(function () {
            socket.emit('message', {
                action: 'seen'
            }, (err)=> {
                if (err) {
                    return alert('err');
                }
            })
        });
        $('#input').keyup(function(e){
            if (e.keyCode !== 13) {
                if (!typing) {
                    typing = true;
                    timeOutSend();
                } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(timeOutSend, 1000);
                }
            } else {
                clearTimeout(timeout);
                socket.emit('message', {
                    group,
                    action: 'receiving',
                    message: $('#input').val().trim()
                }, (err, data) => {
                    if (err) {
                        return alert('err');
                    }
                    const time = new Date();
                    $('.message span').remove();
                    $('#messages').append(`
                        <div class="message me">
                            <p>${data.message}</p>
                            <span>${time.getHours()}:${time.getMinutes()}</span>
                        </div>
                    `);
                    $('#input').val('');
                });
            }
        });
        $('#input').focusout(function(){
            clearTimeout(timeout);
            socket.emit('message', {
                action: 'stop-typing',
                message: 'stop'
            }, (err) => {
                if (err) {
                    return alert('err');
                }
            });
        });
        })
        .catch(error=> {
            throw error;
    });
}
$( document ).ready(function() {
    promiseGroup
        .then((data)=> {
            group = data.result.data[0]._id;
            if (data.result.data && data.result.data.length > 0) {
                for (let i =0, len = data.result.data.length; i < len; i++) {
                    let group = data.result.data[i];
                    $('#list-group').append(`
                        <div id="${group._id}" class="group">
                            <img src="./images/user.png" />
                            <div class="info">
                                <p>${group.name || 'No name'}</p>
                                <span>${group.lastMessage && group.lastMessage.content ? group.lastMessage.content : ''}</span>
                            </div>
                        </div>
                `);
                }
            }
            $('#list-group .group').click(function () {
                if (group !== this.attributes.id.value) {
                    $('#messages').html('');
                } else {
                    group = this.attributes.id.value;
                }
                getListMessage(this.attributes.id.value);
            });

        })
        .catch(error=> {
            throw error;
        });
});

