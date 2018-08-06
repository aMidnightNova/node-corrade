const EventEmitter = require('events').EventEmitter;
const tls = require('tls');
const rl = require('readline');

const querystring = require('querystring');


const axios = require('axios');
const Promise = require('bluebird');


const ERRORS = require('./errors.js');

const auth = require('./models/authorization.js');
const helpers = require('./lib/helpers.js');
const logs = require('./lib/Logs.js');

function Corrade(obj) {
    let _this = this;

    this.protocol = obj.protocol;
    this.group = obj.group;
    this.password = obj.password;
    this.types = obj.types;
    this.basicAuth = typeof obj.basicAuth !== 'undefined' ? obj.basicAuth : null;
    this.host = obj.host;
    this.port = obj.port;

    this.options = {
        port: obj.port,
        host: obj.host
        //      rejectUnauthorized: typeof obj.rejectUnauthorized !== 'undefined' ? obj.rejectUnauthorized : false
    };
    this.REGISTERED_MODULES = {};

    let emitter = new EventEmitter();

    function createSocket(options, group, password, types) {
        let corradeSocket = tls.connect(options, function () {
            corradeSocket.write('group=' + group + '&password=' + password + '&type=' + types.toString() + '\r\n');
        });
        corradeSocket.setKeepAlive(true);
        corradeSocket.setEncoding('utf8');

        let rlInterface = rl.createInterface(corradeSocket, corradeSocket);

        rlInterface.on('line', function (line) {
            let parsedDate = querystring.parse(line.replace(/\r?\n|\r/g, ''));
            if (parsedDate.success === 'True') {
                console.log('Corrade Is Ready!');
            }
            if (parsedDate) {
                emitter.emit('line', parsedDate);
            }
        });


        corradeSocket.on('end', function () {
            console.log('Fin');
        });

        corradeSocket.on('error', function (e) {
            if (e &&
                e.errno === 'ECONNRESET' ||
                e.errno === 'ETIMEDOUT' ||
                e.errno === 'ENOTFOUND' ||
                e.errno === 'ENOENT') {

                console.log('CONNECTION ERROR');
            }
            console.log(e.Error, e.code, e.errno);
        });
        corradeSocket.on('close', function () {
            console.log('CONNECTION CLOSED: attempting to reestablish...');
            corradeSocket = createSocket(_this.options, _this.group, _this.password, _this.types);
        });

        return corradeSocket;
    }

    createSocket(this.options, this.group, this.password, this.types);

    this.on = function (type, cb) {
        if (_this.types.indexOf(type) === -1) return cb(ERRORS[3] += ' type: ' + type);

        emitter.on('line', function (data) {
            if (data.type === type) {
                cb(data)
            }
        })
    };


    this.query = function (options, autoEscape) {

        if (autoEscape) {
            let keys = Object.keys(options);
            let len = keys.length;
            while (len--) {
                options[keys[len]] = querystring.escape(options[keys[len]]);
            }
        }

        options.group = _this.group;
        options.password = _this.password;

        let maybeBasicAuth = {};

        if (_this.basicAuth !== null) {
            maybeBasicAuth = {
                auth: {
                    username: _this.basicAuth.user,
                    password: _this.basicAuth.password
                }
            }
        }

        return axios.post(_this.protocol + '://' + _this.host, querystring.stringify(options), maybeBasicAuth
        ).then(function (res) {
            if (!res.data) return Promise.reject(ERRORS[2]);
            return querystring.parse(res.data).data;
        }).catch(function (e) {
            console.log('axios query error', e);
        })
    };

    this.loadModules = function (modules, authorizedRoles, allowedTypes) {

        modules.forEach(function (item, index, arr) {
            _this.REGISTERED_MODULES[item.name] = {
                authorizedRoles: Array.isArray(authorizedRoles) ? authorizedRoles : null,
                allowedTypes: Array.isArray(allowedTypes) ? allowedTypes : null,
                name: item.name,
                help: Array.isArray(authorizedRoles) ? item.help + '| Restricted to: ' + authorizedRoles.toString() : item.help,
                func: item.func,
            };

        });


    };
    this.runModule = function (moduleName, params) {
        if(_this.REGISTERED_MODULES[moduleName].allowedTypes.indexOf(params.type) === -1 || _this.REGISTERED_MODULES[moduleName].allowedTypes === null) {
            return Promise.reject(ERRORS[8]);
        }

        if (_this.REGISTERED_MODULES[moduleName].authorizedRoles !== null) {

            auth.isAuthorized(_this, _this.REGISTERED_MODULES[moduleName].authorizedRoles, params).then(function () {
                return _this.REGISTERED_MODULES[moduleName].func(_this, params);
            }, function (err) {
                _this.logs.append(err, 'access.log');
                return ERRORS[7];
            })

        }
        return _this.REGISTERED_MODULES[moduleName].func(_this, params);
    };


    //this.isAuthorized = auth.isAuthorized;
    this.helpers = helpers;
    this.logs = logs;

    this.corradeGetGroupMembersByName = function (arrayOfNames) {

        let len = arrayOfNames.length;

        let calls = [];
        for (let i = 0; i < len; ++i) {
            calls.push(_this.query({
                command: 'getmembers',
                sift: 'match,' + querystring.escape('(?i),?\\"([^\\",$]*' + arrayOfNames[i] + '[^\",$]*)\",?')
            }, false).then(function (res) {
                console.log('potato', res);
                if (!res) return Promise.reject(ERRORS[2]);
                return res.replace(/["']/g, '');
            }));
        }

        return axios.all(calls).then(function (res) {
            console.log('RES', res);

            res.forEach(function (item, index, arr) {
                if (!item) {
                    arr.splice(index, 1);
                }
            });
            return res;
        });
    };
    this.corradeGetGroupMemberByName = function (singleName) {

        if (typeof singleName !== 'string') return Promise.reject(ERRORS[6]);

        return _this.corradeGetGroupMembersByName([singleName]).then(function (res) {
            return res;

        }).catch(function (err) {
            console.log(err)
        })
    };


    this.checkIfCommandAndReturnFormattedData = function (data) {

        //let messageAsArray = split(data.message, {separator: ' ',keepQuotes: false});
        let messageAsArray = data.message.match(/(?:[^\s"]+|"[^"]*")+/g); //match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);


        messageAsArray.forEach(function (item, index, arr) {
            arr[index] = item.replace(/^"|"$/g, '').replace(/^'|'$/g, '');// - /["']/g
        });

        return new Promise(function (resolve, reject) {

            if (messageAsArray[0].indexOf('~') === 0 || messageAsArray[0].indexOf('@') === 0) {
                let command = messageAsArray[0].substring(1);
                messageAsArray.shift();

                for (let i = 0; i < messageAsArray.length; ++i) {
                    if (messageAsArray[i].length < 4 && i !== 0) {
                        return reject(ERRORS[0]);
                    }
                }

                if (!_this.REGISTERED_MODULES.hasOwnProperty(command)) {
                    return reject(ERRORS[1]);
                }

                return resolve({
                    lastName: data.lastname,
                    firstName: data.firstname,
                    messageAsArray: messageAsArray,
                    messageAsString: data.message.match(/^(\S+)\s(.*)/) ? data.message.match(/^(\S+)\s(.*)/).slice(1)[1] : data.message,
                    command: command,
                    uuid: data.agent,
                    type: data.type
                });

            }
            return //reject(ERRORS[1])
        })
    };


}

module.exports = Corrade;