process.env.UV_THREADPOOL_SIZE = String(require('os').cpus().length - 1);
process.env.MAX_LISTENERS = String(1000);

const os = require('os');
const mkdirp = require('mkdirp');
const ObjectsToCsv = require('objects-to-csv');
const req = require('sync-request');
const csv = require('csvtojson/v2');
const path = require('path');
const fss = require('fs-extra');

/** 
* Write a literal object to file as a comma-separated values (CSV) file. Like standard writeFile, writeAsCSV() is Async
* @example
* let jsondata = {id: 1, first_name: 'john', last_name: 'white'}
* nodash.writeAsCSV(`${__dirname}/tmp/data.csv`, jsondata); // returns a promise
* @param {String} p - Absolute path to the location of the comma-separated values (CSV) file.
* @param {Object} data - The literal Object to save as a comma-separated values (CSV) file.
* @return {Promise} Void - Represents the completion of an asynchronous operation.
*/
const writeAsCSV = async function (p, data, _debug) {
  for (const i in data) {
    for (const j in data[i]) {
      if (!data[i][j] || data[i][j] === 'undefined') {
        data[i][j] = '';
      }
    }
  }

  const letmesave = new ObjectsToCsv(data);
  await letmesave.toDisk(p);
  if (_debug) console.log(data);
};


/** 
* This is a monkeypatch that embeds the ability to use replace for all instances of a substring instead of just the first one (similar to python's replace)
* @example
* require('nodash')
* const tempString = 'over the rainbow, over and over again'
* tempString.replaceAll('over','oooover')
* console.log(tempString) // => 'oooover the rainbow, oooover and oooover again'
*/
String.prototype.replaceAll = function (search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

/** 
* This is a monkeypatch that embeds the ability to use remove for all instances of a substring.
* @example
* require('nodash')
* const tempString = 'over the rainbow, over and over again'
* tempString.remove('again')
* console.log(tempString) // => 'over the rainbow, over and over'
*/
String.prototype.remove = function (str) {
  return this.replaceAll(str, '');
};

/** 
* Determines if a value is an Object. 
* @example
* let arr = [1,3,4,5]
* isObject(arr) //returns true
* @param {any} a - The value to be checked.
* @return {Boolean} Returns True if the value is an Object. False Otherwise. NOTE: Object does not nessesarity mean only a literal object in javascript.
*/
const isObject = function isObject(a) {
  return (!!a) && (a.construcPtor === Object);
};

/** 
* Determines if a value is a function generator. 
* @example
* function *test(){}
* isGenerator(test) //returns true
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is a function generator. False Otherwise.
*/
const isGenerator = function isGenerator(fn) {
  return fn.constructor.name === 'GeneratorFunction';
};

/** 
* Determines if a value is a class. 
* @example
* class Test{}
* isClass(test) //returns true
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is a class. False Otherwise.
*/
const isClass = function isClass(fn) {
  return fn.constructor.toLowerCase().includes('class');
};

/** 
* Determines if a value is a function. 
* @example
* function test(){}
* isFunction(test) //returns true
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is a function. False Otherwise.
*/
const isFunction = function isFunction(fn) {
  return fn.constructor.name === 'Function';
};

/** 
* Determines if a value is a function generator. 
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is a function generator. False Otherwise.
*/
const isGeneratorFunction = function isGeneratorFunction(fn) {
  return fn.constructor.name === 'GeneratorFunction';
};

/** 
* Determines if a value is an asynchronous function. 
* @example
* async function test(){}
* isAsyncFunction(test) //returns true
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is an asynchronous function. False Otherwise.
*/
const isAsyncFunction = function isAsyncFunction(fn) {
  return fn.constructor.name === 'AsyncFunction';
};

/** 
* Determines if a value is an asynchronous function generator. 
* @example
* async function* test(){}
* isAsyncGenerator(test) //returns true
* @param {any} fn - The value to be checked.
* @return {Boolean} Returns True if the value is an asynchronous function generator. False Otherwise.
*/
const isAsyncGenerator = function isAsyncGenerator(fn) {
  return fn.constructor.name === 'AsyncGeneratorFunction';
};

/** 
* Determines if a value is an array. 
* @example
* let arr = [1,2,3,4,5]
* isArray(arr) //returns true
* @param {any} a - The value to be checked.
* @return {Boolean} Returns True if the value is an array. False Otherwise.
*/
const isArray = function isArray(a) {
  return (!!a) && (a.constructor === Array);
};

/** 
* Determines if a string is a valid url. 
* @example
* let test = 'https://google.com'
* isAsyncGenerator(test) //returns true
* @param {any} a - The string to be checked.
* @return {Boolean} Returns True if the value is a valid url. False Otherwise.
*/
const isUrl = function isUrl(a) {
  return /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.test(a);
};

/** 
* Synchronous get request. Only to be used at the start of the program so as to avoid crashes and other bottlenecks.
* @example
* async function* test(){}
* let test_url = https://sometesturl.com/api/someendpoint.json
* req('GET', test_url) //returns parsed json response
* @param {string} thing - A string containing the address from which to make the get request.
* @return {Object} Returns the result as a literal Object (JSON) - Default Encoding: utf8
*/
const get = function (thing) {
  const res = req('GET', thing);
  return JSON.parse(res.getBody('utf8'));
};

/** 
* This function combines lodash's uniq and sortBy in one.
* @param {Object} data - The data that we need to sort and uniq.
* @param {Object} key - The key to sort againts.
* @return {Object}
*/
const uniqSortBy = function $uniqSortBy(data, key) {
  return _.sortBy(_.uniqBy(data, key), key);
};

/** 
* Similar to php's die with the added convinience of conditional death.
* @param {Boolean} cond - The condition of death.
* @param {Object} hard - An array of messages print out upon death.
* @return {Object}
*/
const diewhen = function diewhen({ cond = 1, ...hard }) {
  if (cond) {
    console.log(hard);
    process.exit(0);
  }
};

/** 
* Similar to php's die. It exits the current node process while also providing the ability to print a message (useful for devbugging)
* @param {Boolean} cond - The condition of death.
* @param {Object} hard - An array of messages print out upon death.
* @return {Object}
*/
const die = function die(...hard) {
  console.log(hard);
  process.exit(0);
};

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
  writeAsCSV,
};
