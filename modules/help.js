let help = {};

help.name = 'help';

help.help = '[@~]help :Lists available commands.';

help.func = function (_this, params) {
    return new Promise(function (resolve, reject) {
        let out = '\n';

        for (let module in _this.REGISTERED_MODULES) {
            if(_this.REGISTERED_MODULES[module].allowedTypes.indexOf(params.type) !== -1 || _this.REGISTERED_MODULES[module].allowedTypes === null ) {
                out += _this.REGISTERED_MODULES[module].help + '\n';
            }
        }
        resolve(out);
    })
};

module.exports = help;