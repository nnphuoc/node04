const arr1 = ['a', 'b'];
const arr2 = ['d', 'c'];
// const results = JSON.parse(JSON.stringify(arr));
const results = [...arr1, ...arr2];
arr1[0] = 'c';
console.log(results, arr1);