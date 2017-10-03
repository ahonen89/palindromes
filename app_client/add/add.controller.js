(function () {
    angular
        .module('palindromeApp')
        .controller('addController', addController);

    addController.$inject = ['$scope', '$mdToast', 'palindrome'];
    function addController($scope, $mdToast, palindromeService) {
        $scope.palindrome = '';

        // check text is palindrome.
        $scope.checkAndAddPalindrome = function() {
            palindromeService.checkAndAddPalindrome($scope.palindrome, function(response) {
                if (response.status == 201) {
                    $scope.showSimpleToast('Successfully added palindrome');
                    // clear field
                    $scope.palindrome = '';
                } else {
                    $scope.showSimpleToast('Text is not a palindrome');
                }
            });
        };

        $scope.showSimpleToast = function(text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        };
    }

}) ();