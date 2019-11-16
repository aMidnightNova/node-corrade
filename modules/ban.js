const parser = require('yargs-parser');
let Promise = require('bluebird');


let ban = {};

ban.name = 'ban';

ban.help = '[@~]ban --action=[add|remove] --name="Legacy Name" --reason="naughty boy" : all fields required, adds or removes a person from the estate ban list.';

ban.func = function (_this, params) {
    const banInfo = parser(params.messageAsString);

    if (typeof banInfo.name === 'undefined') {
        return Promise.reject({code: 100, text: 'please include the legacy name.'});
    }
    if (typeof banInfo.action === 'undefined') {
        return Promise.reject({code: 110, text: 'please include and action.'});
    } else if (['add', 'remove'].indexOf(banInfo.action) === -1) {
        return Promise.reject({code: 111, text: 'action is not valid. please use one: [add,remove].'});
    }
    if (typeof banInfo.reason === 'undefined') {
        return Promise.reject({code: 120, text: 'Please include a reason'});
    }

    let firstAndLast = banInfo.name.split(' ');

    return _this.query({
        command: 'setestatelist',
        type: 'ban',
        action: banInfo.action,
        firstname: firstAndLast[0],
        lastname: firstAndLast[1]

    }).then(function (res) {
        _this.logs.append('ban => ACTION: ' + banInfo.action + ', WHO: ' + banInfo.name  +', BY: ' + params.firstName + ' ' + params.lastName + ', REASON: ' + banInfo.reason, 'admin_actions.log');
        return Promise.resolve('the action \"' + banInfo.action + '\" for ' + banInfo.name + ' has been completed for the estate ban list.');
    }, function (err) {
        _this.logs.append(JSON.stringify(err), 'error.log');
        return Promise.reject(err)
    })

};

module.exports = ban;
