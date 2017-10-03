(function () {
    angular
        .module('palindromeApp')
        .service('palindrome', palindrome);

    palindrome.$inject = ['$http'];

    function palindrome ($http) {
        var checkAndAddPalindrome = function(text, callback) {
            return $http({
                method: 'POST',
                url: '/api/palindromes',
                data: {
                    text: text
                }
            }).then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                callback(response);
            });
        };

        var retrievePalindromes = function(offset, limit, callback) {
            return $http({
                method: 'GET',
                url: '/api/palindromes',
                query: {
                    offset: offset,
                    limit: limit
                }
            }).then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                callback(response);
            });
        };

        return {
            checkAndAddPalindrome: checkAndAddPalindrome,
            retrievePalindromes: retrievePalindromes
        }
    }
}) ();