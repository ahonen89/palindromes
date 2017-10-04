// requires
var async = require('async');
var fs = require('fs');
var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../../../app');
var constants = require('../../../app_api/utils/constants');

// palindromes file path
var palindromesStorageFilePath = __dirname + '/../../../app_api/storage/palindromes.json';
var palindromesStorageDefaultFilePath = __dirname + '/../../../app_api/storage/palindromes.json.default';

var basePath = '/api/palindromes';
var addPalindromesPath = basePath;
var retrievePalindromesPath = basePath;

chai.use(chaiHttp);

var palindromes = [
    'aaaaa',
    'bbbbb',
    'ccccc',
    'ddddd',
    'eeeee'
];

/** Read default file and write its content to actual-used file
 * */
function readDefaultContentAndAddToActualFile() {
    // read default file
    var data = fs.readFileSync(palindromesStorageDefaultFilePath, "utf8");

    // write default content
    fs.writeFileSync(palindromesStorageFilePath, data);
}

describe('API tests', function () {
    // Before test suite, empty the palindromes file
    // Also, set INTERVAL to a lower value, 30 seconds
    before(function (done) {
        readDefaultContentAndAddToActualFile();

        // set INTERVAL to a lower value (for tests purpose)
        constants.INTERVAL_ACTIVE_PALINDROMES = 30 * 1000; // 30 seconds

        done();
    });

    // After test suite, empty the palindromes file
    // Also, set INTERVAL to default value, 10 minutes
    after(function (done) {
        readDefaultContentAndAddToActualFile();

        // set INTERVAL to a lower value (for tests purpose)
        constants.INTERVAL_ACTIVE_PALINDROMES = constants.INTERVAL_ACTIVE_PALINDROMES_DEFAULT; // 10 minutes

        done();
    });

    // Test API: add palindromes
    describe('POST /api/palindromes', function () {
        it('it should add 5 new palindromes', function (done) {
            // async tasks
            var asyncTasks = [];

            for (var i = 0; i < 5; i++) {
                var wrapFunction = function(i) {
                    asyncTasks.push(function(callback) {
                        chai.request(server)
                            .post(addPalindromesPath)
                            .send({
                                "text": palindromes[i]
                            })
                            .end(function (err, res) {
                                res.should.have.status(201);
                                res.body.data.text.should.equal(palindromes[i]);

                                setTimeout(callback, 5000);
                            });
                    });
                };

                wrapFunction(i);
            }

            async.series(asyncTasks, function(err, result) {
                done();
            });
        });
    });

    // Test API: retrieve palindromes
    describe('GET /api/palindromes', function () {
        it('it should retrieve all palindromes', function (done) {
            chai.request(server)
                .get(retrievePalindromesPath)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.palindromes.should.be.a('array');
                    res.body.data.palindromes.length.should.be.eql(5);
                    res.body.data.count.should.equal(5);

                    res.body.data.palindromes[0].text.should.equal(palindromes[0]);
                    res.body.data.palindromes[1].text.should.equal(palindromes[1]);
                    res.body.data.palindromes[2].text.should.equal(palindromes[2]);
                    res.body.data.palindromes[3].text.should.equal(palindromes[3]);
                    res.body.data.palindromes[4].text.should.equal(palindromes[4]);

                    done();
                });
        });
    });

    // Test API: retrieve palindromes with offset
    describe('GET /api/palindromes with offset', function () {
        it('it should retrieve first 3 palindromes', function (done) {
            chai.request(server)
                .get(retrievePalindromesPath)
                .query( {offset: 0, limit: 3} ) // ?offset=0&limit=3
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.data.palindromes.should.be.a('array');
                    res.body.data.palindromes.length.should.be.eql(3);
                    res.body.data.count.should.equal(5);

                    res.body.data.palindromes[0].text.should.equal(palindromes[0]);
                    res.body.data.palindromes[1].text.should.equal(palindromes[1]);
                    res.body.data.palindromes[2].text.should.equal(palindromes[2]);

                    done();
                });
        });
    });

    // Test API: get palindromes
    describe('GET /api/palindromes', function () {
        it('it should retrieve palindromes and begin miss one by one', function (done) {
            // async tasks
            var asyncTasks = [];

            // first, wait 10 seconds to be sure the limit of 30 seconds has passed
            setTimeout(function() {
                for (var i = 0; i < 5; i++) {
                    var wrapFunction = function(i) {
                        asyncTasks.push(function(callback) {
                            chai.request(server)
                                .get(retrievePalindromesPath)
                                .end(function (err, res) {
                                    res.should.have.status(200);
                                    res.body.data.palindromes.should.be.a('array');

                                    if (res.body.data.palindromes[0]) {
                                        res.body.data.palindromes[0].text.should.not.equal(palindromes[i]);
                                    }

                                    if (i == 4) {
                                        res.body.data.count.should.equal(0);
                                    }

                                    setTimeout(callback, 5000);
                                });
                        });
                    };

                    wrapFunction(i);
                }

                async.series(asyncTasks, function(err, result) {
                    done();
                });

            }, 10 * 1000);
        });
    });

});