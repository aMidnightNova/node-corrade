
const parser = require('yargs-parser');
let Promise = require('bluebird');

let teleport = {};

teleport.name = 'teleport';

teleport.help = '[@~]teleport : teleport to location. E.G. @teleport --[pos|position]="<128,128,128>" --[sim|region]="Endless"';

teleport.func = function (_this, params) {

    const posAndLocation = parser(params.messageAsString);


    let _pos = posAndLocation.pos || posAndLocation.position || undefined;
    let _sim = posAndLocation.sim || posAndLocation.region || undefined;
    if (typeof _pos === 'undefined') {
        return Promise.reject({code: 130, text: 'Please include position'});
    }
    if (typeof _sim === 'undefined') {
        return Promise.reject({code: 131, text: 'Please include a region'});
    }


    return _this.query({
        command: 'teleport',
        entity: 'region',
        position: _pos,
        region: _sim,
        fly: 'False'

    }).then(function (res) {
        _this.logs.append(`teleport -> pos: ${_pos}  region: ${_sim}`, 'general.log');
        return Promise.resolve(`teleport to ${_sim} @ ${_pos} complete`);
    }, function (err) {
        _this.logs.append(JSON.stringify(err),'error.log');
        return Promise.reject(err);
    })


};

module.exports = teleport;
