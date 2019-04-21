const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const urlKey = path.resolve('./config');

const readKey = (nameFile) => {
    return new Promise((res, rej) => {
        fs.readFile(urlKey + nameFile, (err, data) => {
            if (err) return rej(err);
            return res(data.toString());
        });
    });
}
const generated = (data, key) => {
        return jwt.sign(data.toString(), key, { algorithm: 'RS256'});
}

const verify = (token, key) => {
    return jwt.verify(token, key, {
            algorithm: 'RS256'
        });
}
module.exports = { generated, verify, readKey };