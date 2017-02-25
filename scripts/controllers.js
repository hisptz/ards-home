/* global angular */

'use strict';

/* Controllers */
var homeControllers = angular.module('homeControllers', [])

//Controller for settings page
    .controller('MainController', function ($rootScope,
                                            $scope, $window, $routeParams, $location, $filter, chartsManager, ModalService, homeService, utilityService) {
        $rootScope.openChildTab = [];
        $rootScope.openChildTab[$routeParams.menuId] = true;
        $scope.showDataCriteria = true;

        $scope.interfacingClass="col-md-10";

        $scope.changeClass = function(){
            $scope.interfacingClass = "col-md-10";
        }

        $scope.$on('hideLeftBar',function(){
            $scope.interfacingClass="col-md-12";
        })

        $scope.$on('extendLeftBar',function(){
            $scope.interfacingClass="col-md-8";
        })

        if ($routeParams.menuId) {
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
            $scope.favourite = $routeParams.favourite;
        }


        $scope.formUnsaved = false;
        $scope.fileNames = [];
        $scope.currentFileNames = [];


        $scope.downloadFile = function (eventUid, dataElementUid, e) {
            eventUid = eventUid ? eventUid : $scope.currentEvent.event ? $scope.currentEvent.event : null;
            if (!eventUid || !dataElementUid) {

                var dialogOptions = {
                    headerText: 'error',
                    bodyText: 'missing_file_identifier'
                };

                DialogService.showDialog({}, dialogOptions);
                return;
            }

            $window.open('../api/events/files?eventUid=' + eventUid + '&dataElementUid=' + dataElementUid, '_blank', '');
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        $scope.deleteFile = function (dataElement) {

            if (!dataElement) {
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

            ModalService.showModal({}, modalOptions).then(function (result) {
                $scope.fileNames[$scope.currentEvent.event][dataElement] = null;
                $scope.currentEvent[dataElement] = null;
                $scope.updateEventDataValue($scope.currentEvent, dataElement);
            });
        };

        $scope.updateFileNames = function () {
            for (var dataElement in $scope.currentFileNames) {
                if ($scope.currentFileNames[dataElement]) {
                    if (!$scope.fileNames[$scope.currentEvent.event]) {
                        $scope.fileNames[$scope.currentEvent.event] = [];
                    }
                    $scope.fileNames[$scope.currentEvent.event][dataElement] = $scope.currentFileNames[dataElement];
                }
            }
        };

        // get report tables
        $scope.getReportTable = function () {

            homeService.getReportTables().then(function(reportTables){

                $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
                $scope.analyticsUrl = "../../../api/analytics.json?dimension=dx:"+$routeParams.dx+"&dimension=pe:"+$routeParams.period+"&dimension=ou:"+$routeParams.orgunit;

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
                $scope.chartObject = {};
                if ( $scope.chartType != "table" && $scope.chartType != "csv" ) {
                    $scope.chartObject = chartsManager.drawChart($scope.analyticsObject,
                        $routeParams.category,
                        [],
                        'dx',
                        [],
                        'none',
                        '',
                        "Chart Name",//$scope.favouriteObject.name
                        $scope.chartType);

                }else{

                    if ( $scope.chartType == "csv" )
                    {
                        $scope.current_date = new Date();
                        $scope.csvObject = chartsManager.createCSV($scope.analyticsObject,
                            $routeParams.category,
                            [],
                            'dx',
                            [],
                            'none',
                            '',
                            "Chart Name",//$scope.favouriteObject.name
                            $scope.chartType);

                    }

                    if ( $scope.chartType == "table" )
                    {
                        $scope.tableObject = chartsManager.drawTable($scope.analyticsObject,
                            $routeParams.category,
                            [],
                            'dx',
                            [],
                            'none',
                            '',
                            "Chart Name",//$scope.favouriteObject.name
                            $scope.chartType);
                    }


                }
                $scope.current_date = new Date();
                $scope.csvObject = chartsManager.createCSV($scope.analyticsObject,
                    $routeParams.category,
                    [],
                    'dx',
                    [],
                    'none',
                    '',
                    "Chart Name",//$scope.favouriteObject.name
                    $scope.chartType);


            });

        }

        homeService.loggedUser().then(function (results) {
            localStorage.setItem("userOrganisationUnits", JSON.stringify(results.organisationUnits));
            $scope.organisationUnits = results.organisationUnits;
            results.organisationUnits.forEach(function (orgUnit) {
                homeService.sortOrganisationUnits(orgUnit, $scope.orgUnitArray);
            });
            $scope.getReportTable();
        });

        $scope.loadMessages = function () {
            $scope.messages = [];
            homeService.getMessages().then(function (response) {

                if (response.messageOne) {
                    $scope.messages.push(response.messageOne);
                }

                if (response.messageTwo) {
                    $scope.messages.push(response.messageTwo);
                }


            });
        };

        $scope.loadCharts = function () {
            return homeService.loadChartStorage();
        }

        $scope.loadCharts().then(function (response) {
            if (response) {
                $scope.charts = response;
            } else {

            }

        }, function (error) {
            console.log(error);
        });





        $scope.loadMessages();


        String.prototype.Capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }


    })

    .controller('homeController', function ($scope, $window, $routeParams, $filter, homeService, utilityService) {

        $scope.currentTab = 'all';
        $scope.oneAtATime = true;
        $scope.show_cms = false;

        String.prototype.Capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        if ($routeParams.tabs) {
            $scope.currentTab = $routeParams.tabs;
            $scope.currentTabCapitaize = $routeParams.tabs.Capitalize();

        } else {
            $scope.currentTabCapitaize = "All";
        }

        if ($routeParams.menuId) {
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
        }


        $scope.loadTabs = function () {
            homeService.getTabs().then(function (response) {

                if (response.success && response.success == false) {
                    $scope.tabs = false;
                } else {
                    $scope.tabs = response;
                }

            }, function (error) {

            });

        }


        var orderBy = $filter('orderBy');
        $scope.noConnection = false;
        $scope.loadArticles = function () {
            homeService.getTabContent().then(function (response) {
                $scope.tabContents = orderBy(response, 'order', false);
                $scope.contentsCounts = $scope.countShownContent($scope.tabContents);
                $scope.noConnection = false;

                if (response.success != 'undefined' && response.success == false) {

                    $scope.noConnection = true;
                }


            });
        }


        $scope.switchPage = function () {
            window.location.href = "/" + dhis2.settings.baseUrl + '/api/apps/cms/index.html';
        }

        $scope.loadMessages = function () {
            $scope.messages = []
            homeService.getMessages().then(function (response) {
                if (response.messageOne) {
                    $scope.messages.push(response.messageOne);
                }

                if (response.messageTwo) {
                    $scope.messages.push(response.messageTwo);
                }
            });
        }

        $scope.countShownContent = function (events) {
            var counts = {All: 0, Agriculture: 0, Livestock: 0, Fisheries: 0, Trade: 0};
            angular.forEach(events, function (value) {

                if (value.category == 'Agriculture') {
                    if (value.shown) {
                        counts.All += 1;
                        counts.Agriculture += 1;
                    }
                }

                if (value.category == 'Livestock') {
                    if (value.shown) {
                        counts.All += 1;
                        counts.Livestock += 1;
                    }
                }

                if (value.category == 'Fisheries') {
                    if (value.shown) {
                        counts.All += 1;
                        counts.Fisheries += 1;
                    }
                }

                if (value.category == 'Trade') {
                    if (value.shown) {
                        counts.All += 1;
                        counts.Trade += 1;
                    }
                }

            })
            return counts;
        }


        if ($routeParams.tabs == "analysis") {
            $scope.showAnalysis = true;
        }

        homeService.loggedUserRole().then(function (loggedIn) {
            var view_cms = false;
            if (loggedIn.indexOf('See CMS') >= 0 || loggedIn.indexOf('ALL') >= 0) {
                view_cms = !view_cms;
            }

            $scope.show_cms = view_cms;

        });


        $scope.loadTabs();
        $scope.loadArticles();
        $scope.loadMessages();

    })

    .controller('analysisPeriodController', function ($scope, $window, $routeParams, $location, $filter, homeService, utilityService) {


    })
    .controller('analysisDataController', function ($scope, $window, $routeParams, $location, $filter, homeService, chartsManager, utilityService, $rootScope) {

        $scope.analyticsUrl = "";
        $scope.analyticsObject = "";
        $scope.chartType = $routeParams.type;
        $scope.orgUnitArray = $routeParams.orgunit.split(';');
        $scope.dataArray = $routeParams.dx.split(';');
        $scope.categoryArray = $routeParams.category.split(';');
        $scope.periodType = getPeriodType($routeParams.period);
        $scope.selectedPeriod = $routeParams.period;

        $rootScope.openChildTab = [];
        $rootScope.openChildTab[$routeParams.menuId] = true;
        $scope.showDataCriteria = true;



        if ($routeParams.menuId) {
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
            $scope.favourite = $routeParams.favourite;
        }

        $scope.periodArray = function (type, year) {

            function inArray(needle, haystack) {
                var count = haystack.length;
                for (var i = 0; i < count; i++) {
                    if (haystack[i] === needle) {
                        return true;
                    }
                }
                return false;
            }

            var periods = [];
            if (type == "Weekly") {
                periods.push({id: '', name: ''})
            } else if (type == "Monthly") {
                periods.push({id: year + '01', name: 'January ' + year, selected: true}, {
                    id: year + '02',
                    name: 'February ' + year
                }, {id: year + '03', name: 'March ' + year}, {id: year + '04', name: 'April ' + year}, {
                    id: year + '05',
                    name: 'May ' + year
                }, {id: year + '06', name: 'June ' + year}, {id: year + '07', name: 'July ' + year}, {
                    id: year + '08',
                    name: 'August ' + year
                }, {id: year + '09', name: 'September ' + year}, {
                    id: year + '10',
                    name: 'October ' + year
                }, {id: year + '11', name: 'November ' + year}, {id: year + '12', name: 'December ' + year})
            } else if (type == "BiMonthly") {
                periods.push({id: year + '01B', name: 'January - February ' + year, selected: true}, {
                    id: year + '02B',
                    name: 'March - April ' + year
                }, {id: year + '03B', name: 'May - June ' + year}, {
                    id: year + '04B',
                    name: 'July - August ' + year
                }, {id: year + '05B', name: 'September - October ' + year}, {
                    id: year + '06B',
                    name: 'November - December ' + year
                })
            } else if (type == "Quarterly") {
                periods.push({id: year + 'Q1', name: 'January - March ' + year, selected: true}, {
                    id: year + 'Q2',
                    name: 'April - June ' + year
                }, {id: year + 'Q3', name: 'July - September ' + year}, {
                    id: year + 'Q4',
                    name: 'October - December ' + year
                })
            } else if (type == "SixMonthly") {
                periods.push({id: year + 'S1', name: 'January - June ' + year, selected: true}, {
                    id: year + 'S2',
                    name: 'July - December ' + year
                })
            } else if (type == "SixMonthlyApril") {
                periods.push({
                    id: year + 'AprilS2',
                    name: 'October 2011 - March 2012',
                    selected: true
                }, {id: year + 'AprilS1', name: 'April - September ' + year})
            } else if (type == "FinancialOct") {
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if (inArray(useYear + 'Oct', $routeParams.period.split(';'))) {
                        periods.push({
                            id: useYear + 'Oct',
                            name: 'October ' + useYear + ' - September ' + useYear,
                            selected: true
                        })
                    } else {
                        periods.push({id: useYear + 'Oct', name: 'October ' + useYear + ' - September ' + useYear})
                    }
                }
            } else if (type == "Yearly") {
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if (inArray(useYear, $routeParams.period.split(';'))) {
                        periods.push({id: useYear, name: useYear, selected: true})
                    } else {
                        periods.push({id: useYear, name: useYear})
                    }

                }
            } else if (type == "FinancialJuly") {

                year = new Date().getFullYear();
                for (var i = 0; i <= 10; i++) {
                    var yearr = year;
                    var useYear = parseInt(year) - i;
                    var comparingValue = useYear + 'July';
                    if (inArray(comparingValue, $routeParams.period.split(';'))) {
                        periods.push({
                            id: useYear + 'July',
                            name: 'July ' + useYear + ' - June ' + yearr,
                            selected: true
                        })
                    } else {
                        periods.push({id: useYear + 'July', name: 'July ' + useYear + ' - June ' + yearr})
                    }
                }
            } else if (type == "FinancialApril") {
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if (inArray(useYear + 'April', $routeParams.period.split(';'))) {
                        periods.push({
                            id: useYear + 'April',
                            name: 'April ' + useYear + ' - March ' + useYear,
                            selected: true
                        })
                    } else {
                        periods.push({id: useYear + 'April', name: 'April ' + useYear + ' - March ' + useYear})
                    }
                }
            } else if (type == "Relative Weeks") {
                periods.push({id: 'THIS_WEEK', name: 'This Week'}, {
                    id: 'LAST_WEEK',
                    name: 'Last Week'
                }, {id: 'LAST_4_WEEK', name: 'Last 4 Weeks', selected: true}, {
                    id: 'LAST_12_WEEK',
                    name: 'last 12 Weeks'
                }, {id: 'LAST_52_WEEK', name: 'Last 52 weeks'});
            } else if (type == "Relative Month") {
                periods.push({id: 'THIS_MONTH', name: 'This Month'}, {
                    id: 'LAST_MONTH',
                    name: 'Last Month'
                }, {id: 'LAST_3_MONTHS', name: 'Last 3 Month'}, {
                    id: 'LAST_6_MONTHS',
                    name: 'Last 6 Month'
                }, {id: 'LAST_12_MONTHS', name: 'Last 12 Month', selected: true});
            } else if (type == "Relative Bi-Month") {
                periods.push({id: 'THIS_BIMONTH', name: 'This Bi-month'}, {
                    id: 'LAST_BIMONTH',
                    name: 'Last Bi-month'
                }, {id: 'LAST_6_BIMONTHS', name: 'Last 6 bi-month', selected: true});
            } else if (type == "Relative Quarter") {
                periods.push({id: 'THIS_QUARTER', name: 'This Quarter'}, {
                    id: 'LAST_QUARTER',
                    name: 'Last Quarter'
                }, {id: 'LAST_4_QUARTERS', name: 'Last 4 Quarters', selected: true});
            } else if (type == "Relative Six Monthly") {
                periods.push({id: 'THIS_SIX_MONTH', name: 'This Six-month'}, {
                    id: 'LAST_SIX_MONTH',
                    name: 'Last Six-month'
                }, {id: 'LAST_2_SIXMONTHS', name: 'Last 2 Six-month', selected: true});
            } else if (type == "Relative Year") {
                periods.push({id: 'THIS_FINANCIAL_YEAR', name: 'This Year'}, {
                    id: 'LAST_FINANCIAL_YEAR',
                    name: 'Last Year',
                    selected: true
                }, {id: 'LAST_5_FINANCIAL_YEARS', name: 'Last 5 Years'});
            } else if (type == "Relative Financial Year") {
                periods.push({id: 'THIS_YEAR', name: 'This Financial Year'}, {
                    id: 'LAST_YEAR',
                    name: 'Last Financial Year',
                    selected: true
                }, {id: 'LAST_5_YEARS', name: 'Last 5 Five financial years'});
            }

            return periods;
        };

        $scope.data = {};
        $scope.data.periodTypes = [
            {name: "Monthly", value: "Monthly"},
            {name: "Quarterly", value: "Quarterly"},
            {name: "Yearly", value: "Yearly"},
            {name: "Financial-July", value: "FinancialJuly"}
        ]

        $scope.changePeriodType = function (periodType) {
            if (periodType != null && periodType != "") {

                var limit = 10;
                var date = new Date();
                var thisYear = date.getFullYear();
                for (var i = 0; i < limit; i++) {
                    var date = new Date((thisYear - i) + "-01" + "-01");
                }
                angular.forEach($routeParams.period.split(';'), function (value, index) {
                    if (valueList.value == value) {
                        $scope.data.periodTypes[periodType].list[indexList].selected = true;
                        $scope.data.periodTypes[periodType].list[indexList].isActive = true;
                        $scope.data.periodTypes[periodType].list[indexList].isExpanded = false;
                    }
                });
            }

        };
        var date = new Date();
        $scope.yearValue = date.getFullYear();

        //loading period settings
        $scope.getPeriodArray = function (type) {
            var periodsArray = [];
            angular.forEach($routeParams.period.split(";"), function (period) {
                periodsArray.push(period)
            });
            var year = null;
            for (var i = 0; i < periodsArray.length; i++) {
                if (periodsArray[i] != "") {
                    year = periodsArray[i].substring(0, 4);
                    break;
                }
            }
            $scope.yearValue = year;

            $scope.data.dataperiods = $scope.periodArray(type, year);
            angular.forEach($scope.data.dataperiods, function (data) {

                if (periodsArray.indexOf(data.id) >= 1) {
                    data.selected = true;
                }
            });
        };

        //loading period settings
        $scope.getnextPrevPeriodArray = function (type) {
            var year = $scope.yearValue;
            $scope.data.dataperiods = $scope.periodArray(type, year);
        };

        //add year by one
        $scope.nextYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) + 1;
            $scope.getnextPrevPeriodArray($scope.periodType);
        };
        //reduce year by one
        $scope.previousYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) - 1;
            $scope.getnextPrevPeriodArray($scope.periodType);
        };

        $scope.changePeriodType = function (type) {
            if (type != null && type != "") {
                $scope.getPeriodArray(type);
            }
        };

        $scope.changePeriodType($scope.periodType);

        $scope.orgunitCallBack = function (item, selectedItems, selectedType) {

            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems, selectedType, $location.path());
            $location.path(criteriaArray.newUrl);
        }

        $scope.periodCallBack = function (item, selectedItems, selectedType) {

        }

        $scope.dataCallBack = function (item, selectedItems, selectedType) {
            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems, selectedType, $location.path());
            $location.path(criteriaArray.newUrl);
        };
        //a function to update chart based on selections
        $scope.chartType = $routeParams.type;
        $scope.updateData = function () {
            $scope.orgunitsArray = [];
            $scope.periodsArray = [];
            $scope.dataArray = [];
            angular.forEach($scope.data.organisationUnitOutPut, function (orgunit) {
                $scope.orgunitsArray.push(orgunit.id)
            });
            angular.forEach($scope.data.outputPeriods, function (period) {
                $scope.periodsArray.push(period.id)
            });
            angular.forEach($scope.data.outputData, function (value) {
                $scope.dataArray.push(value.id)
            });

            var path = '/analysis/menu/' + $routeParams.menuId + '/favourite/' + $routeParams.favourite + '/period/' + $scope.periodsArray.join(";") + '/orgunit/' + $scope.orgunitsArray.join(";") + '/dx/' + $scope.dataArray.join(";") + '/type/' + $scope.chartType + '/category/' + $scope.data.outputCategory[0].id;
            $location.path(path);
        };

        $scope.categoryCallBack = function (item, selectedItems, selectedType) {
            var criteriaArray = homeService.getSelectionCriterias(item, selectedItems, selectedType, $location.path());
        }

        $scope.btnClass = {};
        $scope.btnClass[$routeParams.type] = true;
        $scope.chartSwitcher = function (chartType) {

            angular.forEach($scope.btnClass, function (value, index) {
                $scope.btnClass[index] = false;
            });

            $scope.orgunitsArray = [];
            $scope.periodsArray = [];
            $scope.dataArray = [];

            angular.forEach($scope.data.organisationUnitOutPut, function (orgunit) {
                $scope.orgunitsArray.push(orgunit.id)
            });

            angular.forEach($scope.data.outputPeriods, function (period) {
                $scope.periodsArray.push(period.id)
            });

            angular.forEach($scope.data.outputData, function (value) {
                $scope.dataArray.push(value.id)
            });

            $scope.btnClass[chartType] = true;
            $scope.chartType = chartType;
            var path = '/analysis/menu/' + $routeParams.menuId + '/favourite/' + $routeParams.favourite + '/period/' + $scope.periodsArray.join(";") + '/orgunit/' + $scope.orgUnitArray.join(";") + '/dx/' + $scope.dataArray.join(";") + '/type/' + $scope.chartType + '/category/' + $scope.data.outputCategory[0].id;
            $location.path(path);

        };

        $scope.loadMessages = function () {
            $scope.messages = [];
            homeService.getMessages().then(function (response) {

                if (response.messageOne) {
                    $scope.messages.push(response.messageOne);
                }

                if (response.messageTwo) {
                    $scope.messages.push(response.messageTwo);
                }


            });
        }

        // get report tables
        $scope.getReportTable = function () {

            homeService.getReportTables().then(function(reportTables){

                $scope.analysis = homeService.prepareLeftMenu(reportTables.reportTables);
                $scope.analyticsUrl = "../../../api/analytics.json?dimension=dx:"+$routeParams.dx+"&dimension=pe:"+$routeParams.period+"&dimension=ou:"+$routeParams.orgunit;

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
                $scope.chartObject = {};
                if ( $scope.chartType != "table" && $scope.chartType != "csv" ) {
                    $scope.chartObject = chartsManager.drawChart($scope.analyticsObject,
                        $routeParams.category,
                        [],
                        'dx',
                        [],
                        'none',
                        '',
                        $scope.favouriteObject.name,
                        $scope.chartType);

                }else{

                    if ( $scope.chartType == "csv" )
                    {
                        $scope.current_date = new Date();
                        $scope.csvObject = chartsManager.createCSV($scope.analyticsObject,
                            $routeParams.category,
                            [],
                            'dx',
                            [],
                            'none',
                            '',
                            $scope.favouriteObject.name,
                            $scope.chartType);

                    }

                    if ( $scope.chartType == "table" )
                    {

                        $scope.tableObject = chartsManager.drawTable($scope.analyticsObject,
                            $routeParams.category,
                            [],
                            'dx',
                            [],
                            'none',
                            '',
                           $scope.favouriteObject.name,
                            $scope.chartType);
                    }


                }
                $scope.current_date = new Date();
                $scope.csvObject = chartsManager.createCSV($scope.analyticsObject,
                    $routeParams.category,
                    [],
                    'dx',
                    [],
                    'none',
                    '',
                    $scope.favouriteObject.name,
                    $scope.chartType);


            });

        }

        homeService.loggedUser().then(function (results) {
            localStorage.setItem("userOrganisationUnits", JSON.stringify(results.organisationUnits));
            $scope.organisationUnits = results.organisationUnits;
            results.organisationUnits.forEach(function (orgUnit) {
                homeService.sortOrganisationUnits(orgUnit, $scope.orgUnitArray);
            });
            $scope.getReportTable();
        });

        function getPeriodType(period) {
            var periodArray = period.split(';');
            var periodCount = periodArray.length;
            var period = "";
            if (periodCount > 1) {
                period = periodArray[1];
            } else {
                period = periodArray[0];
            }

            if (period.indexOf('Q') >= 0) {
                return 'Quarterly';
            } else if (period.indexOf('J') >= 0) {
                return 'FinancialJuly'
            } else {
                return 'Monthly'
            }
        }




        $scope.loadMessages();

    });


