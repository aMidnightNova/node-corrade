
const fs = require('fs');
const querystring = require('querystring');

const axios = require('axios');
const Promise = require('bluebird');

const _config = require('../../../corradeConfig.js');

const ERRORS = _config.errors;


let helper = {};

helper.write = function (fileName, data) {
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log(fileName + " was saved!");
    })
};


helper.csv2Obj = function (csv, stride, props) {
    let csvArr = csv.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    let len = csvArr.length;
    let obj = [];
    for (let i = 0; i < len; i = i + stride) {
        let s = i / stride;
        if (props) {
            obj[s] = {};
        } else {
            obj[s] = [];
        }
        for (let j = 0; j < stride; j++) {
            if (props) {
                if(csvArr[i + j]) {
                    obj[s][props[j]] = csvArr[i + j].replace(/^"|"$/g, '');
                } else {
                    obj[s][props[j]] = null;
                }
            } else {
                if(csvArr[i + j]) {
                    obj[s].push(csvArr[i + j].replace(/^"|"$/g, ''));
                } else {
                    obj[s].push(null);
                }

            }
        }
    }
    return obj;
};
helper.csv2arr = function(data, stride) { // the stride is proly worng in this
    let csv = data.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    let len = csv.length;
    let arr = [];

    for (let i = 0; i < len; i = i + stride) {
        let s = i + stride - 1;
        arr.push(csv[s].replace(/^"|"$/g, ''));
    }
    return arr;
};

helper.corradeGetGroupMembersByName = function (nameArr, data) {
    let len = nameArr.length;

    let calls = [];
    for (let i = 1; i < len; ++i) {
        calls.push(data.corrade.query({
            command: 'getmembers',
            sift: 'match,' + querystring.escape('(?i),?\\"([^\\",$]*' + nameArr[i] + '[^\",$]*)\",?')
        }, false).then(function (res) {
            if(!res) return Promise.reject(ERRORS[2]);
            if(res.split(',').length > 1) return Promise.reject(ERRORS[4]);
            return res.replace(/["']/g, '');
        }));
    }

    return axios.all(calls).then(function (res) {
        console.log('RES', res);

        res.forEach(function (item, index, arr) {
            if (!item) {
                arr.splice(index, 1);
            }
        });
        return res;
    });
};

helper.randomNumber = function(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
};

helper.checkIfCommandAndReturnFormattedData = function (data, origin) {

    //let messageAsArray = split(data.message, {separator: ' ',keepQuotes: false});
    let messageAsArray = data.message.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);


    messageAsArray.forEach(function (item, index, arr) {
        arr[index] = item.replace(/^"|"$/g, '').replace(/^'|'$/g, '');// - /["']/g
    });

    return new Promise(function (resolve, reject) {

        if (messageAsArray[0].indexOf('~') === 0 || messageAsArray[0].indexOf('@') === 0) {
            let command = messageAsArray[0].substring(1);
            messageAsArray.shift();

            for (let i = 0; i < messageAsArray.length; ++i) {
                if (messageAsArray[i].length < 4 && i !== 0) {
                    return reject(ERRORS[0]);
                }
            }

            if (origin === 'sl') {
                resolve({
                    lastName: data.lastname,
                    firstName: data.firstname,
                    messageAsArray: messageAsArray,
                    messageAsString: messageAsArray.join(' '),
                    command: command,
                    uuid: data.agent,
                    origin: origin
                });
                return;
            }

            reject(ERRORS[5])
        }
        reject(ERRORS[1])
    })
};

module.exports = helper;