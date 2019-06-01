let heartbeat = {};

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
        let daysAndHours = uptimeArr[0].split('.');

        let _days = daysAndHours[0];
        let _hours = daysAndHours[1];
        let _minutes = uptimeArr[1];


        let uptime = 'Days: ' + String(_days) + '   Hours: ' + String(_hours) + '   Minutes: ' + String(_minutes);
        let ram = (Number(out.ram) / 1024 / 1024).toFixed(2);

        return Promise.resolve(`\nCPU: ${out.cpu}%\nRAM: ${ram} MB\nUptime: ${uptime}\nVersion: ${out.version}`);
    });

};

module.exports = heartbeat;
