const querystring = require('querystring');

const Log = require('../lib/logs.js');

const axios = require('axios');
const Promise = require('bluebird');

const _config = require('../../../corradeConfig.js');


const helpers = require('../lib/helpers.js');

let auth = {};


auth.isAuthorized = function (requestData) {
    return new Promise(function (resolve, reject) {

        return axios.post(_config.fullUrl, querystring.stringify({
                command: 'getmemberroles',
                group: _config.group,
                password: _config.password,
                agent: requestData.uuid
            }),
            {
                auth: {
                    username: _config.basicAuth.user,
                    password: _config.basicAuth.password
                }
            }
        ).then(function (res) {

            let parsedResponse = querystring.parse(res.data);

            if (parsedResponse.error === 'agent not in group') {
                reject('Unauthorized, REASON: ' + parsedResponse.error + ', ORIGIN: ' + requestData.origin +
                    ', REQUESTED BY: ' + requestData.firstName + ' ' + requestData.lastName +
                    ', MESSAGE: ' + requestData.messageAsString);
                return;
            }

            let groupRoles = helpers.csv2arr(parsedResponse.data, 1);

            if (groupRoles.indexOf('Staff') === -1 || groupRoles.indexOf('Owners') === -1) { // TODO: put this into the config file.
                reject('Unauthorized, REASON: not in staff role, ORIGIN: ' + requestData.origin +
                    ' REQUESTED BY: ' + requestData.firstName + ' ' + requestData.lastName +
                    ', MESSAGE: ' + requestData.messageAsString);
                return;

            }
            resolve();

        }).catch(function (e) {
            Log.append('ERROR: ' + e, 'log.txt');
            console.log('ERROR: ', e);
        });

    });

};


module.exports = auth;
