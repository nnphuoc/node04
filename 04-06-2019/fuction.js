let student = {
    name: 12,
    age: '',
    address: ['Danang', 'Quangngai']
}
function validatedStudent(obj) {
    let arrErr = [];
    for (let key in obj) {
        if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            arrErr.push(`${key} invalid`);
        } 
    } 
    if (typeof obj.name !== 'string') {
        arrErr.push('name invalid string');
    }
    if (isNaN(parseInt(obj.age))) {
        arrErr.push('age invalid int');
    }
    if (!Array.isArray(obj.address)) {
        arrErr.push('address invalid array');
    }
    if(arrErr.length === 0){
        return true;
    }
    return arrErr;
}
console.log(validatedStudent(student));