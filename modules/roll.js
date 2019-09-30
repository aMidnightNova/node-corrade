
let Promise = require('bluebird');

let roll = {};

roll.name = 'roll';

roll.help = '[@~]roll <number> : rolls a number between 0 and <number>. If no number is supplied it defaults to 100.';

roll.func = function (_this,params) {

    return new Promise(function (resolve, reject) {
        let number = 100;
        if(params.messageAsArray.length > 0) {
            if(params.messageAsArray.length > 1) {
                reject({code: 201, text: 'Only include a single number after roll'});
                return;
            }

            number = Number(params.messageAsArray[0]);

            if(!Number.isInteger(number) || number < 0) {
                reject({code: 202, text: 'I only accept a proper integer, non negative.'});
                return;
            }

            if(number < 2) {
                reject({code: 203, text: 'number must be 2 or more.'});
                return;
            }
        }
        let out = _this.helpers.randomNumber(1, number);
        resolve(String(out))
    })

};

module.exports = roll;
