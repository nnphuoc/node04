const fs = require('fs');
const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
    { id: 6, name: 'User 6' },
    { id: 7, name: 'User 7' },
    { id: 8, name: 'User 8' },
    { id: 9, name: 'User 9' },
    { id: 10, name: 'User 10' }
];

const products = [
    { id: 1, userId: 2, name: 'Product 1' },
    { id: 2, userId: 3, name: 'Product 2' },
    { id: 3, userId: 3, name: 'Product 3' },
    { id: 4, userId: 5, name: 'Product 4' },
    { id: 5, userId: 6, name: 'Product 5' },
    { id: 6, userId: 4, name: 'Product 6' },
    { id: 7, userId: 6, name: 'Product 7' },
    { id: 8, userId: 7, name: 'Product 8' },
    { id: 9, userId: 5, name: 'Product 9' },
    { id: 10, userId: 10, name: 'Product 10' },
    { id: 11, userId: 7, name: 'Product 11' },
    { id: 12, userId: 5, name: 'Product 12' },
    { id: 13, userId: 9, name: 'Product 13' },
    { id: 14, userId: 3, name: 'Product 14' },
    { id: 15, userId: 7, name: 'Product 15' },
    { id: 16, userId: 10, name: 'Product 16' },
    { id: 17, userId: 2, name: 'Product 17' },
    { id: 18, userId: 6, name: 'Product 18' },
    { id: 18, userId: 6, name: 'Product 19' },
    { id: 20, userId: 1, name: 'Product 20' }
];
const createFile = async (name, data) => {
    await fs.appendFile(name, JSON.stringify(data), err => {
        if (err) throw err;
        console.log('create file success');
    });
}
const readFile = (path) => {
    return new Promise((resolve, reject) =>{
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data.toString());
        });
    });
}
const writeFile = (path, data) => {
    return new Promise((resolve, reject) =>{
        fs.writeFile(path, JSON.stringify(data, null, 2), err => {
            if (err) reject(err);
            resolve(path,'success');
        });
    });
}
const mergeData = (data1, data2, key1, key2, nameResult) => {
    let libraryUser = {};
    for (let i = 0, len = data1.length; i < len; i++) {
        if (!libraryUser[data1[i][key1]]) {
            libraryUser[data1[i][key1]] = [];
        }
        libraryUser[data1[i][key1]].push(data1[i]);
    }
    for (let i = 0, len = data2.length; i < len; i++) {
        if (libraryUser[data2[i][key2]]) {
            data2[i][nameResult] = libraryUser[data2[i][key2]];
        }
    }
    return data2;
}
const loadData = async () => {
    // if (await fs.existsSync('user.json')) {
    //     await createFile('user.json', users);
    // }
    // if (await fs.existsSync('product.json')) {
    //     await createFile('product.json', products);
    // }
    await Promise.all([
        writeFile('user.js', users), 
        writeFile('product.js', products)
    ]);
    const promise = await Promise.all([
        readFile('user.js'), 
        readFile('product.js')
    ]);
    let [dataUsers, dataProducts] = promise;
    const listUsers = mergeData(
            JSON.parse(dataUsers), 
            JSON.parse(dataProducts), 
            'id', 
            'userId', 
            'user'
        );
    const listProducts = mergeData(
            JSON.parse(dataProducts), 
            JSON.parse(dataUsers), 
            'userId', 
            'id', 
            'product'
        );
    await Promise.all([
        writeFile('listUser.js', listUsers), 
        writeFile('listProducts.js', listProducts)
    ]);
}
loadData();