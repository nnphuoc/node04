// loop of array
const arr = ['a','b'];
for (const i of arr) {
    console.log(i);
}

// loop of obj
const obj = {
    'a': 1,
    'b': 2
}
for (const key in obj) {
    console.log(key, obj[key]);
}
