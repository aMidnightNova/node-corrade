const EventEmitter = require('events').EventEmitter;
const tls = require('tls');

const querystring = require('querystring');


const axios = require('axios');
const Promise = require('bluebird');

const _config = require('./config.js');

const ERRORS = _config.errors;


function Corrade(obj) {
    let _this = this;
    this.server = obj.server;
    this.protocol = obj.protocol;
    this.group = obj.group;
    this.password = obj.password;
    this.types = obj.types;
    this.basicAuth = obj.basicAuth || null;

    let emitter = new EventEmitter();

    function createSocket(server, group, password, types) {
        let corradeSocket = tls.connect(8095, server, function () {
            corradeSocket.write('group=' + group + '&password=' + password + '&type=' + types.toString() + '\r\n');
        });
        corradeSocket.setKeepAlive(true);
        corradeSocket.setEncoding('utf8');

        corradeSocket.on('data', function (data) {
            let parsedDate = querystring.parse(data.replace(/\r?\n|\r/g, ''));
            if (parsedDate.success === 'True') {
                console.log('Corrade Is Ready!');
            }
            if (parsedDate.message) {
                emitter.emit('data', parsedDate);
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
            corradeSocket = createSocket(_this.server, _this.group, _this.password, _this.types);
        });

        return corradeSocket;
    }

    createSocket(this.server, this.group, this.password, this.types);

    this.on = function (type, cb) {
        if (_this.types.indexOf(type) === -1) return cb(ERRORS[3] += ' type: ' + type);

        emitter.on('data', function (data) {
            if (data.message && data.type === type) {
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

        return axios.post(_this.protocol + '://' + _this.server, querystring.stringify(options), maybeBasicAuth
        ).then(function (res) {
            if (!res.data) return Promise.reject(ERRORS[2]);
            return querystring.parse(res.data).data;
        }).catch(function (e) {
            console.log('axios query error', e);
        })
    };


}

module.exports = Corrade;