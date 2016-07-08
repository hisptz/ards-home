'use strict';

/* Directives */

var homeDirectives = angular.module('homeDirectives', []);

homeDirectives.directive("homeRightMenu", ['homeService',function(homeService){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messageObject: "=messageObject",
            chartObject: "=chartObject"
        },
        templateUrl: "views/directives/home_right_menu.html",
        link: function($scope, element, attrs) {
            $scope.errors  = false;
            $scope.errorsThree  = false;
            $scope.errorSms  = false;


            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){

                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

            $scope.$watch('chartObject', function(newChartObject, oldChartObject){
                if(typeof newChartObject != "undefined"){

                }
            }, true);


            $scope.checkStatus = function( messages ) {
                var status = true;
                var messageLength = 0;
                if(messages){
                    messageLength = messages.length;
                }


                if(messageLength==1){
                    if(messages[0].hidden){
                        return false;
                    }
                }if(messageLength==0){
                    return false;
                }else{
                    var test = 0;
                    angular.forEach(messages,function(valueS,indexS){
                        if(valueS.hidden){
                            test++;
                        }
                    })

                    if(test==2){
                        return false;
                    }
                }



                return status;
            }


        }
    };
}]);

homeDirectives.directive("homeLeftMenu", ['homeService','utilityService',function(homeService,utilityService){
    return {
        restrict: "E",
        replace: true,
        scope: {
            reportTables: "=reportTables",
            documentObject: "=documentObject",
        },
        templateUrl: "views/directives/home_left_menu.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no document found";

            $scope.loadExternalLinks = function(){

                homeService.listExternalLink().then(function(response){
                    $scope.externalLinks = response;
                });
            }


            // get report tables
            $scope.getReportTable = function () {

                if(localStorage.getItem('reportTables')){
                    $scope.reportTables = utilityService.prepareReportTables(JSON.parse(localStorage.getItem('reportTables')));
                }else{

                    homeService.getReportTables().then(function(data){
                        $scope.reportTables = utilityService.prepareReportTables(data.reportTables);
                        localStorage.setItem('reportTables',JSON.stringify(data.reportTables));
                    },function(error){

                    });
                }


            }

            $scope.getReportTable();



            $scope.loadExternalLinks = function(){

                homeService.listExternalLink().then(function(response){
                    $scope.externalLinks = response;
                });
            }


            $scope.loadExternalLinks();
            $scope.getReportTable();

        }
    };
}]);

homeDirectives.directive("homeTabs", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            currentTab: "=currentTab",
            tabObject: "=tabObject",
            tabContentObject: "=tabContentObject",
            showCms: "=showCms",
        },
        templateUrl: "views/directives/home_tabs.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no chart found";
            $scope.homeTabActiveClass = {};

            $scope.$watch('tabContentObject', function(newtabContentObject, oldtabContentObject){
                $scope.tabContents = newtabContentObject;
            }, true);

            $scope.$watch('tabObject', function(newtabObject, oldtabObject){

                if(newtabObject!=null){
                    $scope.tabs = orderTabs(newtabObject);
                    angular.forEach($scope.tabs,function(tab){
                        var name = tab.value.toLowerCase();
                        tab.name = name;
                        $scope.homeTabActiveClass[tab.value] = {active:""};
                        if(name==$scope.currentTab){
                            $scope.homeTabActiveClass[tab.value].active = "current";
                        }
                    })

                }


            }, true);



            $scope.toggleableTab = function(tabIndex,tab){
                angular.forEach($scope.tabs,function(tab){
                    $scope.activeClass[tab.value].active = "";

                })
                $scope.activeClass[tab.value].active = "current";
            }

            function orderTabs(tabArray){
                var tabs = []
                var tabs = [{value: "All",active:"current"}]
                angular.forEach(tabArray,function(value){
                    if(value=="All"){
                        tabs[0].value=value;
                    }

                    if(value=="Agriculture"){
                        tabs[1]={value: value,active:""};
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value=="Livestock"){
                        tabs[2]={value: value,active:""};
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value=="Fisheries"){
                        tabs[3]={value: value,active:""};
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value=="Trade"){
                        tabs[4]={value: value,active:""};
                        if(tabs[3]==null){
                            tabs[3] = {value: "Fisheries",active:""}
                        }
                    }

                })

                return tabs;
            }


            $scope.switchPage = function(){
                window.location.href = '/demo/api/apps/cms/index.html';
            }


        }
    };
});