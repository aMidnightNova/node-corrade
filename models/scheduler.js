
const schedule = require('node-schedule');

let scheduler = {};

scheduler.schedule = function (_this, cronLineTimeFormat, func) {
    schedule.scheduleJob(cronLineTimeFormat, func)
};

scheduler.interval = function (_this, timeInSeconds, func) {
        _this.INTERVALS.push(setInterval(func,timeInSeconds));
};

module.exports = scheduler;