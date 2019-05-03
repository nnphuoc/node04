'use strict';
import fs from 'fs';
import path from'path';
const pathFile   = path.resolve('../24-04-2019/server/config');

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            console.log(pathFile);
            const body =req.body;
            let id = 1;
            if (!body.username || !body.password) {
                return res.status(401).json({
                    message: 'missing username or password'
                });
            }
            let dataReadFile = fs.readFileSync(pathFile + '/sample-data.json', 'utf8');
            if (!dataReadFile) {
                dataReadFile = [];
            } else {
                if (!Array.isArray(JSON.parse(dataReadFile))) {
                    return res.json({
                        message: 'data in file is not a json'
                    });
                }
                dataReadFile = JSON.parse(dataReadFile);
            }
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
            fs.writeFileSync(pathFile + '/sample-data.json', JSON.stringify(dataReadFile, null, 2), 'utf8');
            return res.status(201).json({
                message: 'success',
                result: {
                    id: id,
                    username: body.username
                }
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getAll (req, res, next) {
        try {
            let dataReadFile = fs.readFileSync(pathFile + '/sample-data.json', 'utf8');
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
        } catch (e) {
            return next(e);
        }
    }
}