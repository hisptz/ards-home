/* global angular */

'use strict';

/* Controllers */
var homeControllers = angular.module('homeControllers', [])

//Controller for settings page
.controller('MainController',function($scope, $window,$routeParams,$http, ModalService,homeService,utilityService) {
    
    $scope.formUnsaved = false;
    $scope.fileNames = [];
    $scope.currentFileNames = [];


    $scope.downloadFile = function(eventUid, dataElementUid, e) {
        eventUid = eventUid ? eventUid : $scope.currentEvent.event ? $scope.currentEvent.event : null;        
        if( !eventUid || !dataElementUid){
            
            var dialogOptions = {
                headerText: 'error',
                bodyText: 'missing_file_identifier'
            };

            DialogService.showDialog({}, dialogOptions);
            return;
        }
        
        $window.open('../api/events/files?eventUid=' + eventUid +'&dataElementUid=' + dataElementUid, '_blank', '');
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
    };
    
    $scope.deleteFile = function(dataElement){
        
        if( !dataElement ){            
            var dialogOptions = {
                headerText: 'error',
                bodyText: 'missing_file_identifier'
            };
            DialogService.showDialog({}, dialogOptions);
            return;
        }
        
        var modalOptions = {
            closeButtonText: 'cancel',
            actionButtonText: 'remove',
            headerText: 'remove',
            bodyText: 'are_you_sure_to_remove'
        };

        ModalService.showModal({}, modalOptions).then(function(result){            
            $scope.fileNames[$scope.currentEvent.event][dataElement] = null;
            $scope.currentEvent[dataElement] = null;
            $scope.updateEventDataValue($scope.currentEvent, dataElement);
        });
    };
    
    $scope.updateFileNames = function(){        
        for(var dataElement in $scope.currentFileNames){
            if($scope.currentFileNames[dataElement]){
                if(!$scope.fileNames[$scope.currentEvent.event]){
                    $scope.fileNames[$scope.currentEvent.event] = [];
                }                 
                $scope.fileNames[$scope.currentEvent.event][dataElement] = $scope.currentFileNames[dataElement];
            }
        }
    };


    String.prototype.Capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
   }




   })

.controller('homeController',function($scope, $window,$routeParams,$filter, homeService,utilityService){

    $scope.currentTab = 'all';
    $scope.oneAtATime = true;
    $scope.show_cms = false;

    String.prototype.Capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

     if($routeParams.tabs){
            $scope.currentTab = $routeParams.tabs;
            $scope.currentTabCapitaize = $routeParams.tabs.Capitalize();

        }else{
            $scope.currentTabCapitaize = "All";
     }

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
    }



    $scope.loadTabs = function(){
        homeService.getTabs().then(function(response){
            $scope.tabs = response;
        });
    }



    var orderBy = $filter('orderBy');
    $scope.loadArticles = function(){
        homeService.getTabContent().then(function(response){
            $scope.tabContents = orderBy(response, 'order', false);
            $scope.contentsCounts = $scope.countShownContent($scope.tabContents);
        });
    }

    $scope.switchPage = function(){
        window.location.href = '/demo/api/apps/cms/index.html';
    }
    // Load favourites report tables
    $scope.getReportTable = function(){
        homeService.getReportTables().then(function(reportTables){
            $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
        });
    }

    $scope.loadMessages = function(){
        $scope.messages = []
        homeService.getMessages().then(function(response){
            if(response.messageOne){
                $scope.messages.push(response.messageOne);
            }

            if(response.messageTwo){
                $scope.messages.push(response.messageTwo);
            }
        });
    }

    $scope.countShownContent = function(events){
        var counts = {All:0,Agriculture:0,Livestock:0,Fisheries:0,Trade:0};
        angular.forEach(events,function(value){

            if(value.category=='Agriculture'){
                if(value.shown){
                    counts.All += 1;
                    counts.Agriculture += 1;
                }
            }

            if(value.category=='Livestock'){
                if(value.shown){
                    counts.All += 1;
                    counts.Livestock += 1;
                }
            }

            if(value.category=='Fisheries'){
                if(value.shown){
                    counts.All += 1;
                    counts.Fisheries += 1;
                }
            }

            if(value.category=='Trade'){
                if(value.shown){
                    counts.All += 1;
                    counts.Trade += 1;
                }
            }

        })
        return counts;
    }
    $scope.loadCharts = function(){
        homeService.getSelectedCharts().then(function(response){
            $scope.charts = response;

        },function(error){
            $scope.errors  = true;
        });
    }

    if($routeParams.tabs =="analysis") {
        $scope.showAnalysis=true;
    }

    homeService.loggedUserRole().then(function(loggedIn){
        var view_cms = false;
        if ( loggedIn.indexOf('See CMS') >= 0 ||  loggedIn.indexOf('ALL') >= 0 ) {
            view_cms=!view_cms;
        }

        $scope.show_cms = view_cms;

    });

    $scope.loadTabs();
    $scope.loadArticles();
    $scope.loadMessages();
    $scope.loadCharts();
    $scope.getReportTable();

})
.controller('analysisController',function($scope, $window,$routeParams,$location,$filter, homeService,utilityService){
        console.log($routeParams);
        if($routeParams.menuId){
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
        }


        $scope.loadMessages = function(){
            $scope.messages = [];
            homeService.getMessages().then(function(response){

                if(response.messageOne){
                    $scope.messages.push(response.messageOne);
                }

                if(response.messageTwo){
                    $scope.messages.push(response.messageTwo);
                }


            });
        }


        // get report tables
        $scope.getReportTable = function () {

            homeService.getReportTables().then(function(reportTables){
                $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
            });

        }


        $scope.loadRawCharts = function(){
            homeService.getCharts().then(function(response){
                var rowcharts = response.charts;
                $scope.loadCharts().then(function(response){
                    if(response){

                        if(response.length==rowcharts.length){
                            $scope.charts = response;//homeService.getSelectedCharts(response.chartsStorage);
                        }else{
                            homeService.saveCharts(rowcharts);
                            if(response.length>0){
                                homeService.updateCharts(rowcharts);
                            }
                        }

                    }else{
                        homeService.saveCharts(rowcharts);
                    }


                },function(error){
                    console.log(error);
                });
            },function(error){

            });
        }

        $scope.loadCharts = function(){
            return homeService.loadChartStorage();
        }

        $scope.getReportTable();
        $scope.loadMessages();
        $scope.loadRawCharts();
        $scope.loadCharts();

    })
.controller('analysisPeriodController',function($scope, $window,$routeParams,$location,$filter, homeService,utilityService){

        if($routeParams.menuId){
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
            $scope.favourite = $routeParams.favourite;
        }


        $scope.loadMessages = function(){
            $scope.messages = [];
            homeService.getMessages().then(function(response){

                if(response.messageOne){
                    $scope.messages.push(response.messageOne);
                }

                if(response.messageTwo){
                    $scope.messages.push(response.messageTwo);
                }


            });
        }


        // get report tables
        $scope.getReportTable = function () {

            homeService.getReportTables().then(function(reportTables){
                $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
            });

        }



        $scope.loadRawCharts = function(){
            homeService.getCharts().then(function(response){
                var rowcharts = response.charts;
                $scope.loadCharts().then(function(response){
                    if(response){

                        if(response.length==rowcharts.length){
                            $scope.charts = response;//homeService.getSelectedCharts(response.chartsStorage);
                        }else{
                            homeService.saveCharts(rowcharts);
                            if(response.length>0){
                                homeService.updateCharts(rowcharts);
                            }
                        }

                    }else{
                        homeService.saveCharts(rowcharts);
                    }


                },function(error){
                    console.log(error);
                });
            },function(error){

            });
        }

        $scope.loadCharts = function(){
            return homeService.loadChartStorage();
        }

        $scope.getReportTable();
        $scope.loadMessages();
        $scope.loadRawCharts();
        $scope.loadCharts();

    })
.controller('analysisDataController',function($scope, $window,$routeParams,$location,$filter, homeService,chartsManager,utilityService){

        $scope.analyticsUrl      = "";
        $scope.analyticsObject   = "";
        $scope.chartType         = $routeParams.type;
        $scope.orgUnitArray      = $routeParams.orgunit.split(';');
        $scope.dataArray         = $routeParams.dx.split(';');
        $scope.categoryArray     = $routeParams.category.split(';');
        $scope.periodType        = null;
        $scope.periodType        = getPeriodType($routeParams.period);



        $scope.showDataCriteria = true;

        if($routeParams.menuId){
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
            $scope.favourite = $routeParams.favourite;
        }

        $scope.data = {periodTypes: {
            "Monthly": {
                name: "Monthly", value: "Monthly", list: [],
                populateList: function (date) {
                    var monthNames = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
                    if (!date) {
                        date = new Date();
                    }
                    this.list = [];
                    var that = this;
                    var year = date.getFullYear();
                    monthNames.forEach(function (monthName, index) {

                        var monthVal = index + 7;

                        if (monthVal > 12) {
                            monthVal = monthVal % 12;
                        }
                        if (monthVal == 1) {
                            year++;
                        }
                        var testDate = new Date();
                        if ((year == testDate.getFullYear() && monthVal > (testDate.getMonth() + 1)) || year > testDate.getFullYear()) {
                            return;
                        }
                        if (monthVal < 10) {
                            monthVal = "0" + monthVal;
                        }
                        that.list.push({
                            name: monthName + " " + year,
                            value: year + "" + monthVal
                        })
                    });
                    if (this.list.length == 0) {
                        this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                    }
                }
            },
            "Quarterly": {
                name: "Quarterly", value: "Quarterly", list: [],
                populateList: function (date) {
                    var quarters = ["July - September", "October - December", "January - March", "April - June"];
                    if (!date) {
                        date = new Date();
                    }
                    //this.list = [];
                    var that = this;
                    var year = date.getFullYear();
                    quarters.forEach(function (quarter, index) {
                        var quarterVal = index + 3;
                        if (quarterVal == 5) {
                            quarterVal = 1;
                        }
                        if (quarterVal == 6) {
                            quarterVal = 2;
                        }
                        if (quarterVal == 1) {
                            year++;
                        }
                        var testDate = new Date();
                        if ((year == testDate.getFullYear() && quarterVal > ((testDate.getMonth() + 1) % 4)) || year > testDate.getFullYear()) {
                            return;
                        }
                        that.list.push({
                            name: quarter + " " + year,
                            value: year + "Q" + quarterVal
                        })
                    });
                    if (this.list.length == 0) {
                        this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                    }
                }
            },
            "Yearly": {
                name: "Yearly", value: "Yearly", list: [],
                populateList: function () {
                    var date = new Date();
                    this.list = [];
                    for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                        this.list.push({name: "" + i,value: "" + i});
                    }
                }
            },
            "FinancialJuly": {
                name: "Financial-July", value: "FinancialJuly", list: [],
                populateList: function () {
                    var date = new Date();
                    this.list = [];
                    var testDate = new Date();

                    for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                        if ((i == testDate.getFullYear() && (testDate.getMonth() + 1) < 7) || (i == (testDate.getFullYear() - 1) && (testDate.getMonth() + 1) < 7) || i > testDate.getFullYear()) {
                            continue;
                        }
                        this.list.push({name: "July " + i + " - June " + (i + 1), value: i + "July"});
                    }
                }
            }
        }}

        $scope.changePeriodType = function(periodType) {

            if ( periodType!=null ) {

                var limit = 10;
                var date = new Date();
                var thisYear = date.getFullYear();
                for( var i=0 ; i<limit ; i++ ) {
                    var date = new Date((thisYear-i)+"-01"+"-01");
                    console.log(thisYear-i);
                    console.log(date);
                    //$scope.data.periodTypes[periodType].populateList(date);
                }



                angular.forEach($scope.data.periodTypes[periodType].list,function(valueList,indexList){
                    angular.forEach($routeParams.period.split(';'),function(value,index){
                        console.log();
                        console.log(valueList.value," = ",value);
                        if(valueList.value == value) {
                            $scope.data.periodTypes[periodType].list[indexList].selected = true;
                            $scope.data.periodTypes[periodType].list[indexList].isActive = true;
                            $scope.data.periodTypes[periodType].list[indexList].isExpanded = false;
                        }
                    });

                })
            }

        }

        $scope.changePeriodType($scope.periodType);



        $scope.orgunitCallBack = function(item, selectedItems,selectedType) {

            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());
            $location.path(criteriaArray.newUrl);
        }

        $scope.periodCallBack = function(item, selectedItems,selectedType) {

            //var criteriaArray = homeService.getSelectionCriterias(selectedOrgUnit, selectedOrgUnits,selectedType,$location.path());
            //console.log(criteriaArray);
            //console.log(selectedOrgUnit);
            //console.log(selectedOrgUnits);
            //console.log(criteriaArray);
        }

        $scope.dataCallBack = function(item, selectedItems,selectedType) {
            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());
            $location.path(criteriaArray.newUrl);
        }

        $scope.categoryCallBack = function(item, selectedItems,selectedType) {
            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());

        }

        $scope.btnClass = {};
        $scope.btnClass[$routeParams.type] = true;
        $scope.chartSwitcher = function(chartType) {

            angular.forEach($scope.btnClass,function(value,index){
                $scope.btnClass[index] = false;
            });

            $scope.btnClass[chartType] = true;
            $scope.chartType = chartType;
            $location.path(homeService.prepareUrlForChange($location.path(),'type',chartType).newUrl);

        }



        $scope.loadMessages = function(){
            $scope.messages = [];
            homeService.getMessages().then(function(response){

                if(response.messageOne){
                    $scope.messages.push(response.messageOne);
                }

                if(response.messageTwo){
                    $scope.messages.push(response.messageTwo);
                }


            });
        }


        // get report tables
        $scope.getReportTable = function () {

            homeService.getReportTables().then(function(reportTables){

                $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
                $scope.analyticsUrl = "../../../api/analytics.json?dimension=dx:"+$routeParams.dx+"&dimension=pe:"+$routeParams.period+"&filter=ou:"+$routeParams.orgunit;

                angular.forEach (reportTables.reportTables, function(value){

                    if (value.id == $scope.favourite ) {
                        $scope.favouriteObject = value;
                    }

                });

                $scope.loadAnalytics($scope.analyticsUrl);

            });

        }


        $scope.loadAnalytics = function (url) {

            homeService.getAnalytics(url).then(function(analytics){
                $scope.analyticsObject = analytics;
                $scope.dataDimension = homeService.getDataDimension(analytics,$scope.dataArray);
                $scope.categoryDimension = homeService.setSelectedCategory([{name:"Administrative Units",id:"ou"},{name:"Period",id:"pe"}],$routeParams.category);
                $scope.chartObject = {
                }
                if ( $scope.chartType != "table" ) {
                    $scope.chartObject = chartsManager.drawChart($scope.analyticsObject,
                        'pe',
                        [],
                        'dx',
                        [],
                        'none',
                        '',
                        $scope.favouriteObject.name,
                        $scope.chartType);

                }else{
                    $scope.tableObject = chartsManager.drawTable($scope.analyticsObject,
                        'pe',
                        [],
                        'dx',
                        [],
                        'none',
                        '',
                        $scope.favouriteObject.name,
                        $scope.chartType);
                }

            });

        }

        homeService.loggedUser().then(function(results){
            homeService.getOrgUnitTree(results.organisationUnits)
                .then(function (results) {

                    $scope.organisationUnits = results.data.organisationUnits;
                    $scope.organisationUnits.forEach(function (orgUnit) {
                        homeService.sortOrganisationUnits(orgUnit,$scope.orgUnitArray);
                    });
                }, function (error) {
                    $scope.organisationUnits = [];

                });
        })


        function getPeriodType(period){
            var periodArray = period.split(';');
            var periodCount = periodArray.length;
            var period = "";
            if ( periodCount > 1) {
                period = periodArray[1];
            }else{
                period = periodArray[0];
            }

            if ( period.indexOf('Q') >= 0 ) {
                return 'Quarterly';
            }
        }

        $scope.loadRawCharts = function(){
            homeService.getCharts().then(function(response){
                var rowcharts = response.charts;
                $scope.loadCharts().then(function(response){
                    if(response){

                        if(response.length==rowcharts.length){
                            $scope.charts = response;//homeService.getSelectedCharts(response.chartsStorage);
                        }else{
                            homeService.saveCharts(rowcharts);
                            if(response.length>0){
                                homeService.updateCharts(rowcharts);
                            }
                        }

                    }else{
                        homeService.saveCharts(rowcharts);
                    }


                },function(error){
                    console.log(error);
                });
            },function(error){

            });
        }

        $scope.loadCharts = function(){
            return homeService.loadChartStorage();
        }

        $scope.getReportTable();
        $scope.loadMessages();
        $scope.loadRawCharts();
        $scope.loadCharts();

    });
