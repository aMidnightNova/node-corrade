
const fs = require('fs');

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



helper.randomNumber = function(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
};
helper.isAgentUuid = function (uuid) {
    return (uuid.substring(8,9) == '-' && uuid.substring(14,15) == 4  && uuid.substring(19,20).match(/[89ab]/));
};


module.exports = helper;