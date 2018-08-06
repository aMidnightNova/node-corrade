let config = {};


config.host = 'bot.example.com';
config.protocol = 'https';
config.group = 'MyGroupHere';
config.password = 'SuperAwesomeStrongPassword';
config.basicAuth = {
    user: 'corrade',
    password: 'Somepassword'
};
config.port = 9000;

config.types = ['group', 'message', 'statistics'];

config.fullUrl = function () {
    return config.protocol + '://' + config.host;
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


let Corrade = require('./corrade.js');


let corrade = new Corrade(config);


let joke = require('./modules/joke.js');
let genericActions = require('./modules/genericActions.js');
let help = require('./modules/help.js');
let ban = require('./modules/ban.js');

corrade.loadModules([joke], null, ['group']);
corrade.loadModules(genericActions(['spank', 'poke', 'fluff', 'tickle', 'hug', 'nuzzle', 'potato']), null, ['group']);
corrade.loadModules([help], null, ['group','message']);
corrade.loadModules([ban], ['Staff', 'Owners'], ['message']);

corrade.on('message', function (data) {
    corrade.checkIfCommandAndReturnFormattedData(data).then(function (res) {
        corrade.runModule(res.command, res).then(function (res2) {
            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: res.uuid,
                message: res2
            }, false)
        }, function (err) {
            console.log(err);
            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: res.uuid,
                message: err.text
            }, false)
        })
    }, function (err) {
        console.log(err);
        corrade.runModule('help', {type: data.type}).then(function (res) {
            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: data.agent,
                message: res
            }, false)
        })
    })
});






corrade.on('group', function (data) {
    corrade.checkIfCommandAndReturnFormattedData(data).then(function (res) {
        corrade.runModule(res.command, res).then(function (res2) {
            corrade.query({
                command: 'tell',
                entity: 'group',
                message: res2
            }, false)
        }, function (err) {
            console.log(err);
            corrade.query({
                command: 'tell',
                entity: 'group',
                message: err.text
            }, false)
        })
    }, function (err) {
        console.log(err);
        corrade.runModule('help', {type: data.type}).then(function (res) {
            corrade.query({
                command: 'tell',
                entity: 'group',
                message: res
            }, false)
        })
    })
});
