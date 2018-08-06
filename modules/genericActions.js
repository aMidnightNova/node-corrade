module.exports = function (actionsArray) {

    let actions = [];

    actionsArray.forEach(function (item, index, arr) {
        actions.push({
            name: item,
            help: '[@~]' + item + ' <legacyname>',
            func: function (_this, params) {
                return _this.corradeGetGroupMemberByName(params.messageAsString).then(function (res) {
                    return '/me ' + item + 's ' + res;
                });

            }
        })
    });
    return actions;
};