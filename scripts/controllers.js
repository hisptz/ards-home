/* global angular */

'use strict';

/* Controllers */
var homeControllers = angular.module('homeControllers', [])

.controller('MainController', function($scope, $window,$routeParams,$location,$http, ModalService,homeService,utilityService) {

    //// layout modals
    $scope.leftColumn = "col-md-2 col-xs-12";
    $scope.centerColumn = "col-md-8 col-xs-12 ";
    $scope.changeBootstrapClass = function(action){
        if(action=="show"){
            $scope.leftColumn = "col-md-2 col-xs-12";
            $scope.centerColumn = "col-md-8 col-xs-12 ";
        }

        if(action=="hide"){
            $scope.leftColumn = "";
            $scope.centerColumn = "col-md-10 col-xs-12 ";
        }

        if(action=="extend"){
            $scope.leftColumn = "col-md-4 col-xs-12";
            $scope.centerColumn = "col-md-6 col-xs-12 ";
        }
    }



    $scope._appPrograms = [];
    $scope._tabProgram = "";
    $scope._tabContentProgram = "";
    $scope._smsProgram = "";
    $scope._linkProgram = "";
    $scope._appCharts = [];
    $scope._currentUser = null;
    $scope._users = [];
    $scope.activeClass = [];
    $scope.documents = [];
    $scope.analysis = [];

    homeService.getUsers().then(function(value){
        $scope._users = homeService.processUsers(value.users);
    });
    homeService.loggedUser().then(function(value){
        $scope._currentUser = value;
    });

    // app resources functions
    $scope.loadPrograms = function(){
        homeService.getPrograms().then(function(response){
            $scope.Programs = $scope.groupPrograms(response.programs);
        });
    }
    $scope.loadCharts = function(){
        homeService.retrieveSetting().then(function(response){
            if(typeof response.selectedCharts!=="undefined"){
                $scope.charts = response.selectedCharts;
            }
        },function(error){
                $scope.errors  = true;
        });
    }

    $scope.groupPrograms = function(appPrograms){
        angular.forEach(appPrograms,function(programObject,programIndex){
            if(programObject.name.indexOf('cms')>=0){
                homeService._appPrograms.push(programObject);

            }
            if(programObject.name.indexOf('home page menu')>=0){
                homeService._tabProgram = programObject;
                $scope._tabProgram = programObject;
                //$scope.createTab(homeService._tabProgram)
                $scope.loadTabs(homeService._tabProgram);
            }
            if(programObject.name.indexOf('cms article')>=0){
                homeService._tabContentProgram = programObject;
                $scope._tabContentProgram = programObject;

                var content = '';
                //$scope.createTabContent(homeService._tabContentProgram,content,"Livestock",2);
                $scope.loadTabContent(homeService._tabContentProgram);
            }
            if(programObject.name.indexOf('cms messages')>=0){
                homeService._smsProgram = programObject;
                $scope._smsProgram = programObject;

                var content = '';
            }
            if(programObject.name.indexOf('cms extenal links')>=0){
                homeService._linkProgram = programObject;

                $scope.loadExternalLinks(homeService._linkProgram);
              }

        });
    }

    $scope.loadTabs = function(tabProgram){
        var eventObject = utilityService.prepareEventObject(tabProgram);
        homeService.getTabs(eventObject).then(function(response){
            $scope.tabs = utilityService.refineTabs(response.events);
        });
    }

    $scope.loadTabContent = function(contentProgram){
        var eventObject = utilityService.prepareEventObject(contentProgram);
        homeService.getTabContent(eventObject).then(function(response){
            $scope.tabContents = utilityService.refineTabContent(response.events);
        });
    }
    $scope.loadExternalLinks = function(contentProgram){

        var eventObject = utilityService.prepareEventObject(contentProgram);
        homeService.getExternalLinks(eventObject).then(function(response){
            $scope.externalLinks = utilityService.refineExternalLinks(response.events);
        });
    }

    $scope.toggleToCMS = function(){

        //$location.path('/api/apps/home/index.html#/cms/articles/sub/all');

    }
    // Load favourites report tables
    $scope.getReportTable = function(){
        homeService.getReportTables().then(function(reportTables){
            $scope.analysis = utilityService.formatAnalysis(reportTables);
        },function(error){
            $scope.analysis = false;
        });
    }


    $scope.loadMessages = function(){

        homeService.retrieveSetting().then(function(response){
            $scope.first_message = null;
            $scope.second_message = null;
            $scope.messages = response.availableMessages;
            angular.forEach($scope.messages,function(value,index){

                if(typeof value.first_message !=="undefined"){
                    $scope.first_message    = value.first_message;
                    $scope.hideFirstMessage = value.hide;

                }

                if(typeof value.second_message !=="undefined"){
                    $scope.second_message    = value.second_message;
                    $scope.hideSecondMessage = value.hide;
                }

            });
        });
    }

    $scope.toggleableCMSTab = function(tab){

        angular.forEach($scope.activeClass,function(tabD,index){
            $scope.activeClass[index] = "";
            if(index==tab){
                $scope.activeClass[index] = "active";
            }
        })

        if(typeof $scope.newMessageForm != "undefined"){
            $scope.newMessageForm = false;
        }

    }




    function switchCMSTab (){
        var link = $location.path();
        console.log(link)
        if(link.indexOf('tab')<=-1){
            var url_length = link.length;
            var home = link.substr(5,url_length-1);
            $scope.activeClass[home] = 'active';
        }else{

        }

    }
    switchCMSTab();

    $scope.users = [
        { icon: "<i class='fa fa-user'></i>",               name: "Leonard Mpande",              maker: "(Opera Software)",        ticked: false  }
    ];


    homeService.getParentOrgUnit().then(function(response){
        angular.forEach(response.organisationUnits,function(value){
            homeService.parentOrganisationUnit  = value.id;
        });
        $scope.loadPrograms();
        $scope.loadMessages();
        $scope.loadCharts();
    },function(){
        console.log("there is error probable the network error");
    });

    $scope.getReportTable();



    String.prototype.Capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

})

.controller('homeController',function($scope, $window,$routeParams,$location, homeService,utilityService){

    $scope.currentTab = 'all';
    if($routeParams.tabs){
        $scope.currentTab = $routeParams.tabs;
        $scope.currentTabCapitaize = $routeParams.tabs.Capitalize();

    }else{
        $scope.currentTabCapitaize = "All";
    }


})
