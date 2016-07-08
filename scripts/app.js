'use strict';

/* App Module */

var home = angular.module('home',
                    ['ui.bootstrap',
                        'ngRoute',
                        'ngCookies',
                        'ngSanitize',
                        'homeDirectives',
                        'homeControllers',
                        'homeServices',
                        'homeFilters',
                        'd2Directives',
                        'd2Services',
                        'd2Controllers',
                        'pascalprecht.translate',
                    'd2HeaderBar'])

.value('DHIS2URL', '..')

.config(function ($routeProvider, $translateProvider) {


    $routeProvider.when('/', {
            templateUrl: "views/home.html",
            controller: 'homeController'
        })
        .when('/:tabs', {
            templateUrl: "views/home.html",
            controller: 'homeController'
        }).when('/analysis', {
            templateUrl: "views/analysis.html",
            controller: 'analysisController'
        })
        .otherwise('/');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});