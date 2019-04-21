const fs = require('fs');
const path = require('path');
const { generated, verify, readKey } = require('./jwt-helper');

const url = path.resolve('../10-04-2019');
const readFile = (fileName) => {
    return new Promise((res, rej) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) return rej(err);
            return res(data.toString());
        })
    });
}
const load = async () => {
    try {
        const data = await readFile(url+'/user.js');
        const publicKey = await readKey('/public-key.key');
        const privateKey = await readKey('/private-key.key');
        const valueGen =  generated(data, privateKey);
        console.log(valueGen);
        const valueVer =  verify(valueGen, publicKey);
        console.log(valueVer);
    } catch (error) {
        
        console.log(error);
    }
}
load();