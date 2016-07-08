'use strict';

/* Directives */

var homeDirectives = angular.module('homeDirectives', []);

homeDirectives.directive("homeRightMenu", function(){
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
            $scope.errorSms  = false;
            $scope.errorMessage  = "no charts found";
            $scope.charts = null;
            $scope.chartCount = 0;

            $scope.$watch('chartObject', function(newchartObject, oldchartObject){
             if(typeof newchartObject=="undefined" || newchartObject.length ==0){
                 $scope.errors = true;
                 $scope.chartCount = 0;
                 $scope.charts = [];
             }else{
                 $scope.charts = newchartObject;
                 $scope.errors = false;
                 $scope.chartCount = 1;
             }
            }, true);

            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){
                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

        }
    };
});
homeDirectives.directive("homeLeftMenu", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            analysisObject: "=analysisObject",
            otherLinksObject: "=otherLinksObject",
            documentObject: "=documentObject",
        },
        templateUrl: "views/directives/home_left_menu.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no document found";

            $scope.$watch('documentObject', function(newdocumentObject, olddocumentObject){
                $scope.documents = newdocumentObject;
                if(newdocumentObject==false){
                    $scope.error = true;
                }
            }, true);


            $scope.$watch('otherLinksObject', function(newotherLinksObject, oldotherLinksObject){
                $scope.externalLinks = newotherLinksObject;
            }, true);



            $scope.$watch('analysisObject', function(newanalysisObject, oldanalysisObject){
                $scope.analysis = newanalysisObject;
            }, true);

        }
    };
});

homeDirectives.directive("homeTabs", function($stateParams){
    return {
        restrict: "E",
        replace: true,
        scope: {
            currentTab: "=currentTab",
            tabObject: "=tabObject",
            tabContentObject: "=tabContentObject",
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
                        $scope.homeTabActiveClass[name] = {active:""};
                        if(name==$scope.currentTab){
                            $scope.homeTabActiveClass[name].active = "current";
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
                angular.forEach(tabArray,function(value){

                    if(value.value=="All"){
                        tabs[0]=value;
                    }

                    if(value.value=="Agriculture"){
                        tabs[1]=value;
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value.value=="Livestock"){
                        tabs[2]=value;
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value.value=="Fisheries"){
                        tabs[3]=value;
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value.value=="Trade"){
                        tabs[4]=value;
                        if(tabs[3]==null){
                            tabs[3] = {value: "Fisheries",active:""}
                        }
                    }

                })

                return tabs;
            }

        }
    };
});