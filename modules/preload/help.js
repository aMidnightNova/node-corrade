let help = {};

help.name = 'help';

help.help = '[@~]help :Lists available commands.';

help.func = function (_this, params) {

    return _this.query({
        command: 'getmemberroles',
        agent: params.uuid
    }).then(function (res) {

        let roles = [];

        if (res.data) {
            roles = _this.helpers.csv2arr(res.data, 1);
        }

        let out = '\n';

        for (let module in _this.REGISTERED_MODULES) {
            if (_this.REGISTERED_MODULES[module].allowedTypes.indexOf(params.type) !== -1) {
                if (_this.REGISTERED_MODULES[module].authorizedRoles === null) {
                    out += _this.REGISTERED_MODULES[module].help + '\n';
                } else {
                    let found = _this.REGISTERED_MODULES[module].authorizedRoles.some(r => roles.includes(r));
                    if(found) out += _this.REGISTERED_MODULES[module].help + '\n';
                }
            }
        }

        return out;

    }, function (err) {
        console.log('error', err)
    });


};

module.exports = help;