let flatjson = {},
    fse = require('fs-extra'),
    Promise = require('bluebird');


const fileSavePath = './flatfile.json';

try {
    fse.readJsonSync(fileSavePath)
} catch (e) {
    fse.writeJsonSync(fileSavePath, {})
}

//set default keys in flatfile
flatjson.defaults = function (arrayOfKeys) {
    return fse.readJson(fileSavePath).then(function (data) {
        let dataKeys = Object.keys(data);
        for (key of arrayOfKeys) {
            if (dataKeys.indexOf(key) === -1) {
                data[key] = [];
            }
        }

        return fse.writeJson(fileSavePath, data).catch(function (err) {
            console.log(err)
        });
    })
};


flatjson.get = function (key) {
    return fse.readJson(fileSavePath).then(function (data) {
        if (typeof data[key] === 'undefined') {
            return Promise.reject('key does not exist')
        }
        return data[key]
    });
};
flatjson.remove = function (key, valueOrKeyValue) {
    return fse.readJson(fileSavePath).then(function (data) {
        if (typeof data[key] === 'undefined') {
            return Promise.reject('key does not exist')
        }

        if (typeof valueOrKeyValue === "object") {
            let index = data[key].find(val => val[key] === valueOrKeyValue.value);
            if (index === -1) {
                return Promise.reject('token does not exist')
            }

            data[key].splice(index, 1);
        } else {
            let index = data[key].indexOf(valueOrKeyValue);
            if (index === -1) {
                return Promise.reject('token does not exist')
            }
            data[key].splice(index, 1);
        }

        return fse.writeJson(fileSavePath, data).then(function (res) {
                console.log(res);
                return data[key];
            },
            function (err) {
                console.log(err)
            });
    });
};

flatjson.removeAll = function (key) {
    return fse.readJson(fileSavePath).then(function (data) {
        if (typeof data[key] === 'undefined') {
            return Promise.reject('key does not exist')
        }
        data[key] = [];
        return fse.writeJson(fileSavePath, data).then(function (res) {
                return data[key];
            },
            function (err) {
                console.log(err)
            });
    });
};


flatjson.set = function (key, value) {
    return fse.readJson(fileSavePath).then(function (data) {

        if (typeof data[key] === 'undefined') {
            return Promise.reject('key does not exist')
        }

        data[key].push(value);

        return fse.writeJson(fileSavePath, data).then(function (res) {
                return data[key];
            },
            function (err) {
                console.log(err)
            });
    })
};


module.exports = flatjson;

