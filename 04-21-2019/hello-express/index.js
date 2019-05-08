const express    = require('express');
const fs         = require('fs');
const bodyParser = require('body-parser');
const path       = require('path');

const app        = express();
const port       = 3000;
const pathFile   = path.resolve('./data');
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/users', (req, res, next) => { //api post user
    try {
        const body =req.body;
        let id = 1;
        if (!body.username || !body.password) {
            return res.status(401).json({
                message: 'missing username or password'
            });
        }
        let dataReadFile = fs.readFileSync(pathFile + '/user.json', 'utf8');
        if (!dataReadFile) {
            dataReadFile = [];
        } else {
            if (!Array.isArray(JSON.parse(dataReadFile))) {
                return res.json({
                    message: 'data in file is not a json'
                });
            }
        }
        dataReadFile = JSON.parse(dataReadFile);
        if (dataReadFile.length > 0){
            for (var i = 0, len = dataReadFile.length; i < len; i++) {
                if (dataReadFile[i].username === body.username) {
                    return res.json({
                        message: 'username is used'
                    })
                }
            }
            id = dataReadFile[dataReadFile.length - 1].id + 1;
        }   
        dataReadFile.push({
            username: body.username,
            password: body.password,
            id
        });
        fs.writeFileSync(pathFile + '/user.json', JSON.stringify(dataReadFile, null, 2), 'utf8');
        return res.status(201).json({
            message: 'success',
            result: {
                id: id,
                username: body.username
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong',
            error
        });   
    }
});

app.get('/api/v1/users', (req, res, next) => { //api get user
    try {
        let dataReadFile = fs.readFileSync(pathFile + '/user.json', 'utf8');
        if (!dataReadFile) {
            dataReadFile = null;
        } else {
            if (!Array.isArray(JSON.parse(dataReadFile))) {
                return res.json({
                    message: 'data in file is not a json'
                });
            }
            dataReadFile = JSON.parse(dataReadFile);
        }
        return res.json({
            message: 'success',
            result: dataReadFile
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong',
            error
        });  
    }
});

app.put('/api/v1/users/:id', (req, res, next) => { //api put user
    try {
        const password =req.body.password;
        const id       = req.params.id;
        if (!password) {
            return res.json({
                message: 'missing password'
            });
        }
        let dataReadFile = fs.readFileSync(pathFile + '/user.json', 'utf8');
        if (!dataReadFile) {
            return res.json({
                message: 'id not found'
            });
        } else {
            if (!Array.isArray(JSON.parse(dataReadFile))) {
                return res.json({
                    message: 'data in file is not a json'
                });
            }
            dataReadFile = JSON.parse(dataReadFile);
            const index = dataReadFile.findIndex( item => { return item.id.toString() === id.toString() });
            if (index < 0) {
                return res.json({
                    message: 'id not found'
                });
            } 
            dataReadFile[index].password = password;
            fs.writeFileSync(pathFile + '/user.json', JSON.stringify(dataReadFile, null, 2), 'utf8');
            return res.json({
                message: 'success'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong',
            error
        });  
    }
});

app.delete('/api/v1/users/:id', (req, res, next) => { //api delete user
    try {
        const id = req.params.id;
        let dataReadFile = fs.readFileSync(pathFile + '/user.json', 'utf8');
        if (!dataReadFile) {
            return res.json({
                message: 'id not found'
            });
        } else {
            if (!Array.isArray(JSON.parse(dataReadFile))) {
                return res.json({
                    message: 'data in file is not a json'
                });
            }
            dataReadFile = JSON.parse(dataReadFile);
            const index = dataReadFile.findIndex( item => { return item.id.toString() === id.toString() });
            console.log(index);
            if (index < 0) {
                return res.json({
                    message: 'id not found'
                });
            } 
            dataReadFile.splice(index, 1);
            fs.writeFileSync(pathFile + '/user.json', JSON.stringify(dataReadFile, null, 2), 'utf8');
            return res.json({
                message: 'success'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong',
            error
        });  
    }
});
/**
 * req (request) Receiving data from client
 * res: (response) Return data to client
 * next: function() => error define, continue
 * res.send() sending data to client
 */
app.listen(port, () => console.log(`Example app listening on port ${port}!`));