
const fs = require('fs');
const helpers = require('../lib/helpers.js');

let joke = {};

joke.name = 'joke';

joke.help = '[@~]joke :tells a joke from the joke library.';

joke.func = function (_this,params) {
    return new Promise(function (resolve, reject) {
        fs.readFile( './files/jokes.txt', 'utf8', function (err, res) {
            if (err) throw err;
            let lines = res.split('\n');
            resolve(lines[helpers.randomNumber(0, lines.length)]);
        })

    })

};

module.exports = joke;