const querystring = require('querystring');

const Log = require('../lib/logs.js');

const axios = require('axios');
const Promise = require('bluebird');


const helpers = require('../lib/helpers.js');

let authorization = {};


authorization.isAuthorized = function (_this, allowedRoles, requestData) {

    return _this.query({
        command: 'getmemberroles',
        agent: requestData.uuid
    }).then(function (res) {
        return new Promise(function (resolve, reject) {
            if (res.error === 'agent not in group') {
                return reject('agent not in group');
            }

            let groupRoles = helpers.csv2arr(res.data, 1);

            let hasAuth = allowedRoles.some(function (value) {
                return groupRoles.includes(value);
            });

            if (!hasAuth) {
                return reject('not in an authorized role');
            } else {
                return resolve();
            }

        })
    });

};

module.exports = authorization;
