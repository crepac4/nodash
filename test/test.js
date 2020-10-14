// id,first_name,last_name,email,gender,ip_address
// 1,Cosetta,Polding,cpolding0@delicious.com,Female,1.42.150.164
// 2,Aluino,Shambrook,ashambrook1@usda.gov,Male,179.229.243.124
// 3,Cedric,Vanacci,cvanacci2@aol.com,Male,83.23.225.162

const nodash = require('../src/index');
const { assert } = require('chai');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require("rimraf");


let jsondata = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/data/1.json`), { encoding: 'utf-8' }));


describe('writeAsCSV', () => {
    it('should much dummy string', async () => {
        rimraf.sync(`${__dirname}/tmp`);
        let comparison_data = `id,first_name,last_name,email,gender,ip_address
1,Ivor,Aymes,iaymes0@yahoo.com,Male,211.50.229.123
2,Alexandro,Marrison,amarrison1@ed.gov,Male,253.118.122.239
3,Adena,Docksey,adocksey2@globo.com,Female,66.38.102.37`;

        mkdirp.sync(`${__dirname}/tmp`);
        await nodash.writeAsCSV(`${__dirname}/tmp/1.csv`, jsondata);
        let csvdata = fs.readFileSync(path.resolve(`${__dirname}/tmp/1.csv`), { encoding: 'utf-8' });
        assert(comparison_data.trim() === csvdata.trim());


    });

    it("should work on JSON files that are above one level", async () => {
        rimraf.sync(`${__dirname}/tmp`);
        mkdirp.sync(`${__dirname}/tmp`);
        comparison_data = `one
"{""two"":""levels deep""}"`
        jsondata = [{ 'one': { 'two': 'levels deep' } }]
        await nodash.writeAsCSV(`${__dirname}/tmp/1.csv`, jsondata);
        let csvdata = fs.readFileSync(path.resolve(`${__dirname}/tmp/1.csv`), { encoding: 'utf-8' });
        assert(comparison_data.trim() === csvdata.trim());


    });
});


describe('isURL', () => {
    it('should identify a correct url', async () => {
        assert( true === nodash.isUrl('https://cs.columbia.edu/~paine/4995'));
        assert( true === nodash.isUrl('http://google.com'));
        assert( true === nodash.isUrl('http://www.google.org'));

    });

    it("should identify an incorrect url", async () => {
        assert(false === nodash.isUrl('https:/#/google.com/'));
        assert(false === nodash.isUrl('://google'));
        assert(false === nodash.isUrl('google.com'));
        assert(false === nodash.isUrl('google'));
    });
});


async function* dummyAsyncGenerator(){}
function* dummyGenerator(){}
function dummyFunction(){}
async function dummyAsyncFunction(){}
let dummyArrowFunction = () => {}
let dummyAsyncArrowFunction = async () => {}
class DummyClass {}

describe('isAsyncGenerator', () => {
    it('should identify an AsyncGenerator', async () => {
        assert( true === nodash.isAsyncGenerator(dummyAsyncGenerator));

    });

    it("it should return false if not an AsyncGenerator", async () => {
        assert( false === nodash.isAsyncGenerator(dummyGenerator));
        assert( false === nodash.isAsyncGenerator(dummyFunction));
        assert( false === nodash.isAsyncGenerator(dummyAsyncFunction));
        assert( false === nodash.isAsyncGenerator(dummyArrowFunction));
        assert( false === nodash.isAsyncGenerator(dummyAsyncArrowFunction));
        assert( false === nodash.isAsyncGenerator(DummyClass));

    });
});


