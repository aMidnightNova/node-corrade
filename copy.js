
const fs = require('fs');

fs.createReadStream('config.js').pipe(fs.createWriteStream('corradeConfig.js'));

fs.createReadStream('example.js').pipe(fs.createWriteStream('example.js'));
