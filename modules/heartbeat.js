let heartbeat = {};
let Promise = require('bluebird');

heartbeat.name = 'heartbeat';

heartbeat.help = '[@~]heartbeat :Tells you the resources used by corrade.';

heartbeat.func = function (_this, params) {
    return _this.query({
        command: 'getheartbeatdata',
        data: 'AverageCPUUsage,AverageRAMUsage,Version,Uptime'
    }).then(function (res) {
        let out = _this.helpers.csv2arr(res.data, 2);

        out = _this.helpers.csv2Obj(out.toString(), 4, ['cpu', 'ram', 'version', 'uptime']);

        out = out[0];

        let uptimeArr = out.uptime.split(':');

        let _days;
        let _hours;
        let _minutes = uptimeArr[1];

        if (uptimeArr[0].indexOf('.') !== -1) {
            let daysAndHours = uptimeArr[0].split('.');

            _days = daysAndHours[0];
            _hours = daysAndHours[1];
        } else {
            _days = '00';
            _hours = uptimeArr[0];
        }


        let uptime = 'Days: ' + String(_days) + '   Hours: ' + String(_hours) + '   Minutes: ' + String(_minutes);
        let ram = (Number(out.ram) / 1024 / 1024).toFixed(2);

        return Promise.resolve(`\nCPU: ${out.cpu}%\nRAM: ${ram} MB\nUptime: ${uptime}\nVersion: ${out.version}`);
    });

};

module.exports = heartbeat;
