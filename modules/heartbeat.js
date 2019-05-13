const helpers = require('../lib/helpers.js');


let heartbeat = {};

heartbeat.name = 'heartbeat';

heartbeat.help = '[@~]heartbeat :Tells you the resources used by corrade.';

heartbeat.func = function (_this, params) {
    return _this.query({
        command: 'getheartbeatdata',
        data: 'AverageCPUUsage,AverageRAMUsage,Version,Uptime'
    }).then(function (res) {
        console.log('killroy', res.data)
        let out = helpers.csv2arr(res.data, 2);

        out = helpers.csv2Obj(out.toString(), 4, ['cpu', 'ram', 'version', 'uptime']);

        console.log('out', out[0])
        out = out[0];

        let uptimeArr = out.uptime.split(':')
        let uptime = 'Days: ' + Math.floor(uptimeArr[0] / 24) + '   Hours: ' + String(uptimeArr[0]) + '   Minutes: ' + String(uptimeArr[1]);
        let ram = (Number(out.ram) / 1024 / 1024).toFixed(2);

        return Promise.resolve(`\nCPU: ${out.cpu}%\nRAM: ${ram} MB\nUptime: ${uptime}\nVersion: ${out.version}`);
    });

};

module.exports = heartbeat;
