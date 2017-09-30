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
        // log errors file is broken
        console.log("Errors file is broken. Please fix and then try restart the application");

        // don't start app if errors file is broken
        process.exit(1);
    }
};

/** Get error by error name. Replace tokens with data. Add details object to the error object
 * */
var getError = function(errorName, messageTokens, details) {
    // get error
    var error = errors[errorName];

    if (!error) {
        // return with general SERVER_ERROR
        return errors['SERVER_ERROR'];
    }


};

module.exports = {
    init: init,
    getError: getError
};