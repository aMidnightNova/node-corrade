const parser = require('yargs-parser');
let Promise = require('bluebird');


let estateTeleportHome = {};

estateTeleportHome.name = 'tphome';

estateTeleportHome.help = '[@~]tphome  --name="Legacy Name" --reason="naughty boy" : all fields required, estate teleports a person home.';

estateTeleportHome.func = function (_this, params) {
    const ejectNameAndReason = parser(params.messageAsString);

    if (typeof ejectNameAndReason.name === 'undefined') {
        return Promise.reject({code: 100, text: 'please include the legacy name.'});
    }

    if (typeof ejectNameAndReason.reason === 'undefined') {
        return Promise.reject({code: 120, text: 'Please include a reason'});
    }

    return _this.query({
        command: 'estateteleportusershome',
        avatars: ejectNameAndReason.name

    }).then(function (res) {
        _this.logs.append('tphome => WHO: ' + ejectNameAndReason.name  +', BY: ' + params.firstName + ' ' + params.lastName + ', REASON: ' + ejectNameAndReason.reason, 'admin_actions.log');
        return Promise.resolve(ejectNameAndReason.name + ' has been teleported home.');
    }, function (err) {
        _this.logs.append(JSON.stringify(err), 'error.log');
        return Promise.reject(err)
    })

};

module.exports = estateTeleportHome;
