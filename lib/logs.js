const fs = require('fs');
const moment = require('moment-timezone');

let log = {};

log.append = function (string, logName) {
    let out = moment().format('MM-DD-YYYY h:mm:ss A') + ' -> ' + string + '\n';
    fs.appendFile('./logs/' + logName, out, function (err) {
        if (err) console.log(err);
    });
};

module.exports = log;