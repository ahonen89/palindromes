// requires
var fs = require('fs');
var errorsJSONFilePath = __dirname + '/../errors/errors.json';

// cache errors
var errors = null;

/** Init errors
 * */
var init = function() {
    // read file content
    var content = fs.readFileSync(errorsJSONFilePath, "utf8");

    try {
        errors = JSON.parse(content);
    } catch (exception) {
        // log error if file is broken
        console.log("Errors file is broken. Please fix and then try to restart the application");

        // don't start app if errors file is broken
        process.exit(1);
    }
};

/** Get error by error name. Replace tokens with data. Add details object to the error object
 * @param errorName String
 * @param messageTokens Object containing tokens and their values
 * @param details Object
 * */
var getError = function(errorName, messageTokens, details) {
    // get error
    var error = errors[errorName];

    if (!error) {
        // return with general SERVER_INTERNAL_ERROR
        return errors['SERVER_INTERNAL_ERROR'];
    }

    // check tokens object contains values
    if (messageTokens && Object.keys(messageTokens).length > 0) {
        // get error message tokens
        var tokens = getTokens(error['message']);
        if (tokens) {
            tokens.forEach(function(token) {
                error['message'] = error['message'].replace(token, messageTokens[token.replace(/%/g, '')]);
            });
        }
    }

    // add details object to the error
    error['details'] = details || {};

    return error;
};

/** Check text has tokens (e.g. %token%) to be replaced
 * @param text
 * */
function getTokens(text) {
    // use the RegExp to find tokens inside text
    var tokensRegexp = /%[A-Za-z0-9]+%/gi;
    var tokens = text.match(tokensRegexp);

    return tokens;
}

module.exports = {
    init: init,
    getError: getError
};