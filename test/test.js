// id,first_name,last_name,email,gender,ip_address
// 1,Cosetta,Polding,cpolding0@delicious.com,Female,1.42.150.164
// 2,Aluino,Shambrook,ashambrook1@usda.gov,Male,179.229.243.124
// 3,Cedric,Vanacci,cvanacci2@aol.com,Male,83.23.225.162

const { assert } = require('chai');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const nodash = require('../src/index');

let jsondata = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/data/1.json`), { encoding: 'utf-8' }));

describe('writeAsCSV', () => {
  it('should much dummy string', async () => {
    rimraf.sync(`${__dirname}/tmp`);
    const comparison_data = `id,first_name,last_name,email,gender,ip_address
1,Ivor,Aymes,iaymes0@yahoo.com,Male,211.50.229.123
2,Alexandro,Marrison,amarrison1@ed.gov,Male,253.118.122.239
3,Adena,Docksey,adocksey2@globo.com,Female,66.38.102.37`;

    mkdirp.sync(`${__dirname}/tmp`);
    await nodash.writeAsCSV(`${__dirname}/tmp/1.csv`, jsondata);
    const csvdata = fs.readFileSync(path.resolve(`${__dirname}/tmp/1.csv`), { encoding: 'utf-8' });
    assert(comparison_data.trim() === csvdata.trim());
  });

  it('should work on JSON files that are above one level', async () => {
    rimraf.sync(`${__dirname}/tmp`);
    mkdirp.sync(`${__dirname}/tmp`);
    comparison_data = `one
"{""two"":""levels deep""}"`;
    jsondata = [{ one: { two: 'levels deep' } }];
    await nodash.writeAsCSV(`${__dirname}/tmp/1.csv`, jsondata);
    const csvdata = fs.readFileSync(path.resolve(`${__dirname}/tmp/1.csv`), { encoding: 'utf-8' });
    assert(comparison_data.trim() === csvdata.trim());
  });
});

describe('isURL', () => {
  it('should identify a correct url', async () => {
    assert(nodash.isUrl('https://cs.columbia.edu/~paine/4995') === true);
    assert(nodash.isUrl('http://google.com') === true);
    assert(nodash.isUrl('http://www.google.org') === true);
  });

  it('should identify an incorrect url', async () => {
    assert(nodash.isUrl('https:/#/google.com/') === false);
    assert(nodash.isUrl('://google') === false);
    assert(nodash.isUrl('google.com') === false);
    assert(nodash.isUrl('google') === false);
  });
});

async function* dummyAsyncGenerator() {}
function* dummyGenerator() {}
function dummyFunction() {}
async function dummyAsyncFunction() {}
const dummyArrowFunction = () => {};
const dummyAsyncArrowFunction = async () => {};
class DummyClass {}

describe('isAsyncGenerator', () => {
  it('should identify an AsyncGenerator', async () => {
    assert(nodash.isAsyncGenerator(dummyAsyncGenerator) === true);
  });

  it('it should return false if not an AsyncGenerator', async () => {
    assert(nodash.isAsyncGenerator(dummyGenerator) === false);
    assert(nodash.isAsyncGenerator(dummyFunction) === false);
    assert(nodash.isAsyncGenerator(dummyAsyncFunction) === false);
    assert(nodash.isAsyncGenerator(dummyArrowFunction) === false);
    assert(nodash.isAsyncGenerator(dummyAsyncArrowFunction) === false);
    assert(nodash.isAsyncGenerator(DummyClass) === false);
  });
});
