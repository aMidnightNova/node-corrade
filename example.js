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


let corrade = new Corrade(config, {tokens: ['your','hardset','tokens']});

let joke = require('./modules/joke.js');
let genericActions = require('./modules/genericActions.js');
let generatesecret = require('./modules/tokenFactory.js');
let ban = require('./modules/ban.js');
let events = require('./modules/events.js');
let heartbeat = require('./modules/heartbeat.js');
let teleport = require('./modules/teleport.js');


corrade.loadModules([joke], null, ['group', 'objectim','regionsayto']);
corrade.loadModules(genericActions(['spank', 'poke', 'fluff', 'tickle', 'hug', 'nuzzle', 'potato']), null, ['group', 'objectim','regionsayto']);
corrade.loadModules([generatesecret], ['Owners'], ['message']);
corrade.loadModules([events], null, ['group', 'message', 'objectim','regionsayto']);
corrade.loadModules([ban, heartbeat, teleport], ['Staff', 'Owners'], ['message', 'objectim','regionsayto']);

corrade.on('message', function (data) {
    corrade.logs.append(data.message, 'general.log');
    corrade.checkIfCommandAndReturnFormattedData(data).then(function (res) {
        corrade.runModule(res.command, res).then(function (res2) {

            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: res.uuid,
                message: res2
            }, false)
        }, function (err) {
            console.log(err)
            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: res.uuid,
                message: err.text
            }, false)
        })
    }, function (err) {
        console.log(err)
        corrade.runModule('help', {type: data.type}).then(function (res2) {
            corrade.query({
                command: 'tell',
                entity: 'avatar',
                agent: data.agent,
                message: res2
            }, false)
        })
    })
});


corrade.on('group', function (data) {
    if (corrade.group !== data.group) return;

    corrade.checkIfCommandAndReturnFormattedData(data).then(function (res) {
        corrade.runModule(res.command, res).then(function (res2) {
            corrade.query({
                command: 'tell',
                entity: 'group',
                target: data.group,
                message: res2
            }, false)
        }, function (err) {
            corrade.query({
                command: 'tell',
                entity: 'group',
                target: data.group,
                message: err.text
            }, false)
        })
    }, function (err) {
        console.log(err);
        corrade.runModule('help', {type: data.type}).then(function (res2) {
            corrade.query({
                command: 'tell',
                entity: 'group',
                target: data.group,
                message: res2
            }, false)
        })
    })
});




let objectCallback = function (data) {
    corrade.checkIfCommandAndReturnFormattedData(data).then(function (res) {
        corrade.runModule(res.command, res).then(function (res2) {
            if (res.callbackUrl) {
                axios.post(res.callbackUrl, res2).then(function (res) {
                    // console.log(res.data, res.status, res.headers)
                });
            } else {
                corrade.query({
                    command: 'tell',
                    entity: 'avatar',
                    agent: data.owner,
                    message: res2
                }, false)
            }
        }, function (err) {
            if (res.callbackUrl) {
                axios.post(res.callbackUrl, err.text).then(function (res) {
                    console.log(res.data, res.status)
                });
            } else {
                corrade.query({
                    command: 'tell',
                    entity: 'avatar',
                    agent: data.owner,
                    message: err.text
                }, false)
            }
        })
    }, function (err) {
        console.log(err);
        corrade.runModule('help', {type: data.type}).then(function (res2) {
            if (err.callbackUrl) {
                axios.post(err.callbackUrl, err.text + res2).then(function (res) {
                    console.log(res.data, res.status)
                });
            } else {
                corrade.query({
                    command: 'tell',
                    entity: 'avatar',
                    agent: data.owner,
                    message: err.text + res2
                }, false)
            }

        })
    })
};

corrade.on('objectim', objectCallback);
corrade.on('regionsayto', objectCallback);