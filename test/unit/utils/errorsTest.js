// requires
var chai = require('chai');
var should = chai.should();

var errors = require('../../../app_api/utils/errors');

// init errors module
errors.init();

describe('getError', function() {
    it('should return PALINDROMES_FILE_ERROR', function() {
        var error = errors.getError("PALINDROMES_FILE_ERROR", null, { 'info': 'additional details about error' });

        error.should.have.code = 1002;
        error.message.should.equal('Palindromes file is not well formatted');
        error.details.should.deep.equal({
            info: 'additional details about error'
        });
    });

    it('should return SERVER_INTERNAL_ERROR', function() {
        var error = errors.getError("UNEXISTING_ERROR", null, { 'info': 'additional details about error' });

        error.should.have.code = 1000;
        error.message.should.equal('Server internal error');
        error.details.should.deep.equal({});
    });

    it('should return error with tokens replaced', function() {
        var error = errors.getError("PALINDROME_ERROR", { 'text': 'not a palindrome' }, { text: 'not a palindrome' });

        error.should.have.code = 1003;
        error.message.should.equal('Text \'not a palindrome\' is not a palindrome');
        error.details.should.deep.equal({
            text: 'not a palindrome'
        });
    });
});
