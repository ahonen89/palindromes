// requires
var chai = require('chai');
var should = chai.should();

var utils = require('../../../app_api/utils/utils');

// mock response object
var mockResponse = {
    code: 500,
    content: {},
    status: function(statusCode) {
        mockResponse.code = statusCode;
    },
    json: function(cont) {
        mockResponse.content = cont;
    }
};

describe('sendJSONResponse', function() {
    it('should return 200', function() {
        utils.sendJSONResponse(mockResponse, 200, { msg: 'success', data: { values: [1, 2, 3] } });

        mockResponse.should.have.code = 200;
        mockResponse.content.should.deep.equal({
            message: "success",
            data: {
                values: [1, 2, 3]
            }
        });
    });

    it('should return 404', function() {
        utils.sendJSONResponse(mockResponse, 400, { error: { 'info': 'something bad happened' } });

        mockResponse.should.have.code = 400;
        mockResponse.content.should.deep.equal({
            error: {
                'info': 'something bad happened'
            }
        });
    });
});
