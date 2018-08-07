const querystring = require('querystring');

const Log = require('../lib/logs.js');

const axios = require('axios');
const Promise = require('bluebird');


const helpers = require('../lib/helpers.js');

let authorization = {};


authorization.isAuthorized = function (_this, allowedRoles, requestData) {
    return new Promise(function (resolve, reject) {

        return axios.post(_this.protocol + '://'+ _this.host, querystring.stringify({
                command: 'getmemberroles',
                group: _this.group,
                password: _this.password,
                agent: requestData.uuid
            }),
            {
                auth: {
                    username: _this.basicAuth.user,
                    password: _this.basicAuth.password
                }
            }
        ).then(function (res) {

            let parsedResponse = querystring.parse(res.data);

            if (parsedResponse.error === 'agent not in group') {
                reject('agent not in group');
                return;
            }

            let groupRoles = helpers.csv2arr(parsedResponse.data, 1);

            let hasAuth = allowedRoles.some(function (value) {
                return groupRoles.includes(value);
            });
            if (!hasAuth) {
                reject('not in an authorized role');
                return;

            }
            resolve();

        }).catch(function (e) {
            Log.append('ERROR: ' + e, 'error.log');
            console.log('ERROR: ', e);
        });

    });

};


module.exports = authorization;
