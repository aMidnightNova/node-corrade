
const _config = require('./config.js');
const ERRORS = _config.errors;

const helpers = require('./lib/helpers.js');
const Corrade = require('./corrade.js');


let corrade = new Corrade(_config);


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