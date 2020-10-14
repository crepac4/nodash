process.env.UV_THREADPOOL_SIZE = String(require('os').cpus().length - 1);
process.env.MAX_LISTENERS = String(1000);
const os = require('os');
const mkdirp = require('mkdirp');
const ObjectsToCsv = require('objects-to-csv');
const req = require('sync-request');
const csv = require("csvtojson/v2");
const path = require('path');
const fss = require('fs-extra');

const writeAsCSV = async function(p, data,debug) {

    for (const i in data) {
        for (const j in data[i]) {
            if(!data[i][j] || data[i][j] === 'undefined') {
                data[i][j] = '';
            }
        }
    }

    const letmesave = new ObjectsToCsv(data);
    await letmesave.toDisk(p);
    if (debug)
    console.log(data);
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.remove = function (str) {
    return this.replaceAll(str, '');
};



const isObject = function isObject(a) {
    return (!!a) && (a.constructor === Object);
};

const isGenerator = function isGenerator(fn) {
    return fn.constructor.name === 'GeneratorFunction';
}

const isClass = function isClass(fn) {
    return fn.constructor.toLowerCase().includes('class');
}

const isFunction = function isFunction(fn) {
    return fn.constructor.name === 'Function';
}
const isGeneratorFunction = function isGeneratorFunction(fn) {
    return fn.constructor.name === 'GeneratorFunction';
}

const isAsyncFunction = function isAsyncFunction(fn) {
    return fn.constructor.name === 'AsyncFunction';
}

const isAsyncGenerator = function isAsyncGenerator(fn) {
    return fn.constructor.name === 'AsyncGeneratorFunction';
}

const isArray = function isArray(a) {
    return (!!a) && (a.constructor === Array);
};

const isUrl = function isUrl(a) {
    return /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.test(a);
}



const get = function $get(thing) {
    const res = req('GET', thing);
    return JSON.parse(res.getBody('utf8'));
};

const uniqSortBy = function $uniqSortBy(data, key) {
    return _.sortBy(_.uniqBy(data, key), key);
}

const diewhen = function diewhen({ cond = 1, ...hard }) {
    if (cond) {
        console.log(hard);
        process.exit(1);
    }
}

const die = function die(...hard) {
    console.log(hard);
    process.exit(0);
}






module.exports = {
    get,
    uniqSortBy,
    diewhen,
    isGenerator,
    isClass,
    isFunction,
    isGeneratorFunction,
    isAsyncGenerator,
    isObject,
    isArray,
    isUrl,
    die,
    isAsyncFunction,
    writeAsCSV
};