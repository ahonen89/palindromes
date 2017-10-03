(function () {
    angular
        .module('palindromeApp')
        .controller('listController', listController);

    listController.$inject = ['$scope', 'palindrome'];
    function listController($scope, palindromeService) {
        // store palindromes
        $scope.palindromesList = [];

        $scope.currentOffset = 0;
        $scope.maxRowsOnPage = 10;

        // check text is palindrome.
        $scope.getPalindromes = function() {
            palindromeService.retrievePalindromes($scope.currentOffset , $scope.maxRowsOnPage, function(response) {
                if (response.status == 200) {
                    // $scope.showSimpleToast('Successfully added palindrome');
                    // update palindromes list
                    $scope.palindromesList = response.data.data.palindromes;
                } else {
                    $scope.showSimpleToast(response);
                }
            });
        };

        $scope.getPalindromes();
    }

}) ();