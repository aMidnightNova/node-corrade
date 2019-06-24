const parser = require('yargs-parser');

const crypto = require('crypto');

let tokenFactory = {};


tokenFactory.name = 'tokenfactory';

tokenFactory.help = '[@~]tokenfactory :creates and saves a secret to use with corrade';

tokenFactory.func = function (_this, params) {
    return new Promise(function (resolve, reject) {


        const commands = parser(params.messageAsString);

        if (typeof commands.remove !== 'undefined') {
            if (commands.remove === 'all') {
                _this.flatjson.removeAll('tokens').then(function (tokens) {
                    _this.TOKENS.token_factory = tokens;
                    resolve(commands.remove + ' tokens removed')
                }).catch(function (e) {
                    reject({code: 201, text: e})
                })

            } else {
                _this.flatjson.remove('tokens', commands.remove).then(function (tokens) {
                    _this.TOKENS.token_factory = tokens;
                    resolve(commands.remove + ' removed')
                }).catch(function (e) {
                    reject({code: 201, text: e})
                })
            }
        } else if (typeof commands.generate !== 'undefined') {
            let secret = crypto.randomBytes(16).toString('hex');

            _this.flatjson.set('tokens', secret).then(function (tokens) {
                _this.TOKENS.token_factory = tokens;
                resolve(secret)
            }).catch(function (e) {
                reject({code: 201, text: e})
            });
            // resolve(secret)
        } else if (typeof commands.list !== 'undefined') {
            _this.flatjson.get('tokens').then(function (tokens) {
                resolve('\n' + tokens.join('\n'))
            }).catch(function (e) {
                reject({code: 201, text: e})
            })


        }


    })

};

tokenFactory.init = function (_this) {
    _this.flatjson.defaults(['tokens']).then(function () {
        _this.flatjson.get('tokens').then(function (tokens) {
            _this.TOKENS.token_factory = tokens;
        }).catch(function (e) {
            throw new Error(e)
        })
    });


};

module.exports = tokenFactory;