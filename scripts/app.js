'use strict';

/* App Module */

var home = angular.module('home',
    ['ui.bootstrap',
        'ngRoute',
        'ui.router',
        'ngCookies',
        'ngSanitize',
        'highcharts-ng',
        'datatables',
        'ckeditor',
        'isteven-multi-select',
        'homeDirectives',
        'homeControllers',
        'homeServices',
        'homeFilters',
        'd2Services',
        'd2Controllers',
        'pascalprecht.translate',
        'd2HeaderBar',
        'd2Directives'
    ])

    .value('DHIS2URL', '../../../')

    .config(function ($translateProvider, $routeProvider, $stateProvider, $urlRouterProvider) {


            $routeProvider.when('/home/all', {
                templateUrl: "views/home.html",
                controller: 'homeController'
            })
            .when('/home/:tabs', {
                templateUrl: "views/home.html",
                controller: 'homeController'
            })


        .otherwise('/home/all');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
    });
