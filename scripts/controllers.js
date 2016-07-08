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
            var mainmenu = new Array();
            var menuarr = [{'name':"Agriculture",values:[]},{'name':"Livestock",values:[]},{'name':"Fishery",values:[]},{'name':"Trade",values:[]},{'name':"General Information",values:[]}];
            var arrayCounter = 0;

            $.each( reportTables.reportTables, function( key, value ) {
                var arr = value.displayName.split(':');
                if(arr.length != 1){
                    angular.forEach(menuarr,function(menuValue){
                        if(arr[0] == menuValue.name){
                            menuValue.values.push({id:value.id,displayName:arr[1],shortName:arr[1].substring(0,20)+"..."});
                        }
                    })

                }
            });
            $scope.analysis = menuarr;
        },function(error){
            $scope.analysis = false;
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

.controller('analysisController',function($scope, $window,$routeParams,$filter, homeService,utilityService){

    $(".listmenu").hover(function(){
        var origin = $(this).find('a').html()
        $(this).find('a').html($(this).attr('allstring'))
        $(this).attr('allstring',origin);
    },function(){
        var origin = $(this).find('a').html()
        $(this).find('a').html($(this).attr('allstring'))
        $(this).attr('allstring',origin);
    });

    var name ="";
    var first_orgunit =new Array();
    var first_period = new Array();

        var url1 = '../../../api/reportTables/' + $routeParams.id + '.json?fields=*,dataDimensionItems[dataElement[id,name]]';
        $('#mainarea').html("");

        //prepare data multselect from data_element.js

        $.getJSON(url1, function (data) {
            console.log(data);
            name = data.name;
            var data_element_select = "";
            $.each(data.dataDimensionItems, function (key, value) {
                data_element_select += "<option value='" + value.dataElement.id + "' selected='selected'>" + value.dataElement.name + "</option>";
            });
            $.each(data.organisationUnits, function (key, value) {
                first_orgunit[key] = value.id;
            });

            $.each(data.periods, function (key, value) {
                first_period[key] = value.id;
            });
            //prepare period Multselect from periods.js
            $('.data-element').multiselect().multiselectfilter();
            preparePeriods(first_period);
            $(".data-element").multiselectfilter("destroy");
            $(".data-element").multiselect("destroy");
            $(".data-element").css('width', '180px');
            $('.data-element').html(data_element_select).multiselect().multiselectfilter();

            //creating organization unit multselect from orgUnit.js
//                prepareOrganisationUnit(first_orgunit);

            //creating organization unit multselect
            var district = [];
            var districtOptions="<optgroup label='Districts'>";
            var regions = [];
            var regionsOptions = "<optgroup label='Regions'>";
            var allunits = [];
            var allunitsOptions ="";
            $.getJSON( "scripts/analysis/organisationUnits.json", function( data ) {
                $.each( data.organisationUnits, function( key, value ) {
                    //populate regions
                    if(value.level == 2){
                        var temp ={ name: value.name, id: value.id };
                        regions.push(temp);
                        if($.inArray(value.id, first_orgunit) == -1){
                            regionsOptions += '<option value="'+value.id+'">'+value.name+' Region</option>';
                        }else{
                            regionsOptions += '<option value="'+value.id+'" selected="selected">'+value.name+' Region</option>';
                        }
                    }
                    //populate districts
                    if(value.level == 3){
                        var temp ={ name: value.name, id: value.id };
                        district.push(temp);
                        if($.inArray(value.id, first_orgunit) == -1){
                            districtOptions += '<option value="'+value.id+'">'+value.name+'</option>';
                        }else{
                            districtOptions += '<option value="'+value.id+'" selected="selected">'+value.name+'</option>';
                        }
                    }


                });
                regionsOptions += "<optgroup/>"
                districtOptions += "<optgroup/>"
                allunitsOptions = regionsOptions + districtOptions
                $('.adminUnit').multiselect().multiselectfilter();
                $('#allunits').click(function(){
                    $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                    $(this).removeClass('btn-default').addClass('btn-success');
                    $(".adminUnit").multiselectfilter("destroy");
                    $(".adminUnit").multiselect("destroy");
                    $('.adminUnit').html(allunitsOptions);
                    $('.adminUnit').multiselect().multiselectfilter();
                })
                $('#district').click(function(){
                    $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                    $(this).removeClass('btn-default').addClass('btn-success');
                    $(".adminUnit").multiselectfilter("destroy");
                    $(".adminUnit").multiselect("destroy");
                    $('.adminUnit').html(districtOptions);
                    $('.adminUnit').multiselect().multiselectfilter();
                })
                $('#regions').click(function(){
                    $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                    $(this).removeClass('btn-default').addClass('btn-success');
                    $(".adminUnit").multiselectfilter("destroy");
                    $(".adminUnit").multiselect("destroy");
                    $('.adminUnit').html(regionsOptions);
                    $('.adminUnit').multiselect().multiselectfilter();
                })
                $('.adminUnit').css('width', '180px');
                $('#allunits').trigger('click')

                //hiding error alert
                $('.alert').hide();

                $('.reports button').click(function () {
                    $('#mainarea').html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading...')
                    var orgunit = $(".adminUnit").val();
                    var dataelement = $('.data-element').val();
                    var timeperiod = $(".periods").val();
                    if (!orgunit || !dataelement || !timeperiod) {
                        $('.alert').fadeIn('slow');
                        setTimeout(function () {
                            $('.alert').fadeOut('slow');
                        }, 3000);
                    } else {
                        //identifying active report
                        $('.reports button').removeClass('btn-success').addClass('btn-default');
                        $(this).removeClass('btn-default').addClass('btn-success');

                        //preparing a link to send to analytics
                        var data_dimension = 'dimension=dx:';
                        for (var i = 0; i < dataelement.length; i++) {
                            data_dimension += (i == dataelement.length - 1) ? dataelement[i] : dataelement[i] + ';';
                        }

                        //creating column dimension
                        var column_dimension = 'dimension=' + $('select[name=category]').val() + ':';
                        //if column will be administrative units
                        if ($('select[name=category]').val() == 'ou') {
                            for (var i = 0; i < orgunit.length; i++) {
                                column_dimension += (i == orgunit.length - 1) ? orgunit[i] : orgunit[i] + ';';
                            }
                        }
                        else { //if column will be periods
                            for (var i = 0; i < timeperiod.length; i++) {
                                column_dimension += (i == timeperiod.length - 1) ? timeperiod[i] : timeperiod[i] + ';';
                            }
                        }

                        //creating filter dimensions
                        var filter = ($('select[name=category]').val() != 'ou') ? 'filter=ou:' : 'filter=pe:'
                        //if filter will be administrative units
                        if ($('select[name=category]').val() != 'ou') {
                            for (var i = 0; i < orgunit.length; i++) {
                                filter += (i == orgunit.length - 1) ? orgunit[i] : orgunit[i] + ';';
                            }
                        }
                        else { //if filter will be periods
                            for (var i = 0; i < timeperiod.length; i++) {
                                filter += (i == timeperiod.length - 1) ? timeperiod[i] : timeperiod[i] + ';';
                            }
                        }

                        var url = '../../../api/analytics.json?' + data_dimension + '&' + column_dimension + '&' + filter


                        //checking types of report needed and react accordingly
                        //drawing table
                        if ($(this).attr('id') == 'draw_table') {
                            drawTable(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing bar chart
                        if ($(this).attr('id') == 'draw_bar') {
                            drawBar(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing column chart
                        if ($(this).attr('id') == 'draw_column') {
                            drawColumn(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing line chart
                        if ($(this).attr('id') == 'draw_line') {
                            drawLine(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing pie chat
                        if ($(this).attr('id') == 'draw_pie') {
                            drawPie(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing staked chat
                        if ($(this).attr('id') == 'draw_staked') {
                            drawStaked(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing spider chat
                        if ($(this).attr('id') == 'draw_spider') {
                            drawSpider(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //drawing combined chat
                        if ($(this).attr('id') == 'draw_combined') {
                            drawCombined(name, url, $('select[name=category]').val(), $('.data-element').val());
                        }
                        //exporting data to excel
                        if ($(this).attr('id') == 'export_cvs') {
                            window.location = '../../../api/analytics.xls?' + data_dimension + '&' + column_dimension + '&' + filter;
                        }
                    }
                })
                $(".category").multiselect({
                    multiple: false,
                    header: "Select an option",
                    noneSelectedText: "Select an Option",
                    selectedList: 1
                });
                $(".category").css('width', '180px');
                $('#content_to_hide').hide();
                $('.analysis-wraper').fadeIn();
                $('#draw_table').trigger("click");

            });
        });

})
