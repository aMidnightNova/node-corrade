
const fs = require('fs');

console.log(__dirname);

fs.createReadStream('config.js').pipe(fs.createWriteStream('corradeConfig.js'));

fs.createReadStream('example.js').pipe(fs.createWriteStream('example.js'));
