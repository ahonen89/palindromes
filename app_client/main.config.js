function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // UI routing
    // Set default state
    $urlRouterProvider.otherwise("/add");

    $stateProvider
        // Add palindrome page
        .state('add', {
            url: "/add",
            templateUrl: "add/add.view.html",
            controller: 'addController',
            controllerAs: 'vm'
        })

        // Palindromes list page
        .state('list', {
            url: "/list",
            templateUrl: "list/list.view.html",
            controller: 'listController',
            controllerAs: 'vm'
        })
}

angular
    .module('palindromeApp')
    .config(configState)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
