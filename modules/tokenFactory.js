const parser = require('yargs-parser');
const helpers = require('../lib/helpers.js');

let flatjson = require('../lib/flatjson.js');


const crypto = require('crypto');


let tokenFactory = {};

tokenFactory.name = 'tokenfactory';

tokenFactory.help = '[@~]tokenfactory :creates and saves a secret to use with corrade';

tokenFactory.func = function (_this, params) {
    return new Promise(function (resolve, reject) {


        const commands = parser(params.messageAsString);

        if (typeof commands.remove !== 'undefined') {
            if (commands.remove === 'all') {
                flatjson.removeAll('tokens').then(function (tokens) {
                    _this.TOKENS.token_factory = tokens;
                    resolve(commands.remove + ' tokens removed')
                }).catch(function (e) {
                    reject({code: 201, text: e})
                })

            } else {
                flatjson.remove('tokens', commands.remove).then(function (tokens) {
                    _this.TOKENS.token_factory = tokens;
                    resolve(commands.remove + ' removed')
                }).catch(function (e) {
                    reject({code: 201, text: e})
                })
            }
        } else if (typeof commands.generate !== 'undefined') {
            let secret = crypto.randomBytes(16).toString('hex');

            flatjson.set('tokens', secret).then(function (tokens) {
                _this.TOKENS.token_factory = tokens;
                resolve(secret)
            }).catch(function (e) {
                reject({code: 201, text: e})
            });
            // resolve(secret)
        } else if (typeof commands.list !== 'undefined') {
            flatjson.get('tokens').then(function (tokens) {
                resolve('\n' + tokens.join('\n'))
            }).catch(function (e) {
                reject({code: 201, text: e})
            })


        }


    })

};

tokenFactory.init = function (_this) {
    flatjson.defaults(['tokens']).then(function () {
        flatjson.get('tokens').then(function (tokens) {
            _this.TOKENS.token_factory = tokens;
        }).catch(function (e) {
            throw new Error(e)
        })
    });


};

module.exports = tokenFactory;