function configState($stateProvider, $urlRouterProvider, $compileProvider, $mdThemingProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // define custom theme
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');


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
