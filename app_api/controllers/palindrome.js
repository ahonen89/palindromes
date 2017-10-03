// requires
var fs = require('fs');
var utils = require('../utils/utils');
var errors = require('../utils/errors');

// palindromes file path
var palindromesStorageFilePath = __dirname + '/../storage/palindromes.json';

/** Check if text is a palindrome
 * @param text
 * */
function isPalindrome(text) {
    // Lowercase the string and use the RegExp to remove unwanted characters from it
    var removeChars = /[^A-Za-z0-9]/g;
    var lowRegStr = text.toLowerCase().replace(removeChars, '');

    // split string into chars array, reverse array, recompose string from reversed char array
    var reverseStr = lowRegStr.split('').reverse().join('');

    // test that initial text equals the recomposed text
    return reverseStr === lowRegStr;
}

/** Checks "req.body.text" is palindrome and adds it to palindromes file if successful.
 * @param req HTTP request object
 * @param res HTTP response object
 */
var addPalindrome = function (req, res) {
    // body must contain the text to be checked for palindrome
    if (!req.body.text) {
        return utils.sendJSONResponse(res, 400, { error: errors.getError("REQUIRED_BODY_PARAM_ERROR", { 'param': 'text' }) });
    }

    // check req.body.text is a palindrome
    if (isPalindrome(req.body.text)) {
        try {
            // read palindromes file
            var data = fs.readFileSync(palindromesStorageFilePath, "utf8");
            // parse content as JSON
            var jsonData = JSON.parse(data);
            // check "palindromes" property exists and is an array
            if (jsonData['palindromes'] && Array.isArray(jsonData['palindromes'])) {
                jsonData['palindromes'].push({
                    text: req.body.text,
                    received: new Date().getTime()
                });
            }

            // overwrite file with content including new added palindrome
            fs.writeFileSync(palindromesStorageFilePath, JSON.stringify(jsonData));

            // respond with success
            utils.sendJSONResponse(res, 201, {msg: 'Successfully added palindrome', data: {text: req.body.text} });
        } catch (exception) {
            // something went wrong
            return utils.sendJSONResponse(res, 500, { error: errors.getError("SERVER_INTERNAL_ERROR", null, exception) });
        }
    } else {
        // text is not palindrome. send response
        return utils.sendJSONResponse(res, 400, { error: errors.getError("PALINDROME_ERROR", { 'text': req.body.text }, {text: req.body.text}) });
    }
};

/** Retrieve list of palindromes.
 * @param req HTTP request object.
 * @param res HTTP response object
 */
var retrievePalindromes = function (req, res) {
    try {
        // read palindromes file
        var data = fs.readFileSync(palindromesStorageFilePath, "utf8");
        // parse content as JSON
        var jsonData = JSON.parse(data);
        // check "palindromes" property exists and is an array
    } catch (exception) {
        // return exception
        return utils.sendJSONResponse(res, 500, { error: errors.getError("SERVER_INTERNAL_ERROR", null, exception) });
    }

    // check property exists and is an array
    if (jsonData['palindromes'] && Array.isArray(jsonData['palindromes'])) {
        // define 10 minutes ago in miliseconds
        var tenMinutesAgoInMiliseconds = new Date().getTime() - 10*60*1000;
        // get only palindromes received in last ten minutes
        var palindromesReceivedInLastTenMinutes = jsonData.palindromes.filter(function(palindromeObject) {
            return palindromeObject.received > tenMinutesAgoInMiliseconds;
        });

        // get offset and limit from query params
        var offset = req.query.offset ? parseInt(req.query.offset) : 0;
        var limit = req.query.limit ? offset + parseInt(req.query.limit) : palindromesReceivedInLastTenMinutes.length;
        // slice array based on offset and limit
        var palindromesSliced = palindromesReceivedInLastTenMinutes.slice(offset, limit);

        // respond with palindromes list
        return utils.sendJSONResponse(res, 200, {msg: 'Successfully retrieved list of palindromes', data: { count: palindromesReceivedInLastTenMinutes.length, palindromes: palindromesSliced } });
    } else {
        return utils.sendJSONResponse(res, 400, { error: errors.getError("PALINDROMES_FILE_ERROR", null) });
    }
};

module.exports = {
    addPalindrome: addPalindrome,
    retrievePalindromes: retrievePalindromes
};