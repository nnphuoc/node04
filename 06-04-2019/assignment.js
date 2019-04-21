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

// bt1: show list product have data of user
function mergeDataProduct(users, products) {
    const results = products.map( product => {
        const indexUser = users.findIndex(user => {
            return product.userId === user.id;
        });
        if (indexUser !== -1) {
            product.user = users[indexUser];
        }
        delete product.userId;
        return product;
    });
    return results;
}
console.log('List product\n',mergeDataProduct(users, products));

//bt2: show list user have array product user.product = ['Product 18']
function mergeDataUser(users, products) {
    const results = users.map( user => {
        user.product = products.filter(product => {
            return product.userId === user.id;
        });
        return user;
    });
    return results;
}
console.log('List user\n',mergeDataUser(users, products));