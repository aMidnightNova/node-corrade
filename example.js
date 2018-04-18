
const _config = require('../../corradeConfig.js');
const ERRORS = _config.errors;


const Corrade = require('node-corrade');


let corrade = new Corrade(_config);
let helpers = corrade.Helpers;

corrade.on('message', function (data) {
    console.log(data);
    helpers.checkIfCommandAndReturnFormattedData(data, 'sl').then(function (res) {
            console.log(res);
        },
        function (e) {
            console.log('e', e);
            if (e.code === 0) {
                if (data.type === 'group') {
                    corrade.query({
                        command: 'tell',
                        entity: 'group',
                        message: ERRORS[0].text
                    }, false);
                }

            }

        })
});



corrade.on('group', function (data) {

    helpers.checkIfCommandAndReturnFormattedData(data, 'sl').then(function (res) {
            console.log(res);
        },
        function (e) {
            if (e.code === 0) {
                if (data.type === 'group') {
                    corrade.query({
                        command: 'tell',
                        entity: 'group',
                        message: ERRORS[0].text
                    }, false);
                }

            }
        })


});