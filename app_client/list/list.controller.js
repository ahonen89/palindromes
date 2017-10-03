(function () {
    angular
        .module('palindromeApp')
        .controller('listController', listController);

    listController.$inject = ['$scope', 'palindrome'];
    function listController($scope, palindromeService) {
        // store palindromes
        $scope.palindromesList = [];

        $scope.palindromesCount = 0;
        $scope.currentOffset = 0;
        $scope.pages = 0;
        $scope.currentPage = 1;
        $scope.limits = [3, 5, 7];
        $scope.maxRowsOnPage = $scope.limits[2];

        // check text is palindrome.
        $scope.getPalindromes = function() {
            palindromeService.retrievePalindromes($scope.currentOffset , $scope.maxRowsOnPage, function(response) {
                if (response.status == 200) {
                    // $scope.showSimpleToast('Successfully added palindrome');
                    // update palindromes list
                    $scope.palindromesCount = response.data.data.count;
                    $scope.pages = ($scope.palindromesCount % $scope.maxRowsOnPage == 0) ? parseInt($scope.palindromesCount / $scope.maxRowsOnPage)
                                : parseInt($scope.palindromesCount / $scope.maxRowsOnPage) + 1;
                    $scope.palindromesList = response.data.data.palindromes;
                } else {
                    $scope.showSimpleToast(response);
                }
            });
        };

        // go to first page
        $scope.goToFirstPage = function() {
            $scope.currentPage = 1;
            $scope.currentOffset = 0;

            $scope.getPalindromes();
        };

        // go to last page
        $scope.goToLastPage = function() {
            $scope.currentPage = $scope.pages;
            $scope.currentOffset = parseInt(($scope.currentPage - 1) * $scope.maxRowsOnPage);

            $scope.getPalindromes();
        };

        // go to previous page
        $scope.goToPreviousPage = function() {
            var previousPage = $scope.currentPage - 1;
            $scope.currentPage = (previousPage < 1) ? 1 : previousPage;
            $scope.currentOffset = parseInt(((previousPage < 1 ? 1 : previousPage) - 1) * $scope.maxRowsOnPage);

            $scope.getPalindromes();
        };

        // go to next page
        $scope.goToNextPage = function() {
            var nextPage = $scope.currentPage + 1;
            $scope.currentPage = (nextPage > $scope.pages) ? $scope.pages : nextPage;
            $scope.currentOffset = parseInt(((nextPage > $scope.pages ? $scope.pages : nextPage) - 1) * $scope.maxRowsOnPage);

            $scope.getPalindromes();
        };


        $scope.getPalindromes();
    }

}) ();