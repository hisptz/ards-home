/* global angular */

'use strict';

/* Services */

var homeServices = angular.module('homeServices', ['ngResource']);

homeServices.service('homeService',['$http','DHIS2URL',function($http,DHIS2URL){
    var home = this;
    home.baseUrl = DHIS2URL;
    home._appPrograms = [];
    home._tabProgram = null;
    home._tabContentProgram = null;
    home._smsProgram = null;
    home.parentOrganisationUnit = null;

    home.getParentOrgUnit = function(){
        var url = home.baseUrl+"/api/organisationUnits.json?paging=false&&filter=level:eq:1";
        return $http.get(url).then(handleSuccess, handleError('Error loading parent org unit groups'));
    }


    home.getPrograms = function(){
        var url = home.baseUrl+"/api/programs.json?filter=programType:eq:WITHOUT_REGISTRATION&filter=name:ilike:cms&&paging=false&fields=id,name,version,categoryCombo[id,isDefault,categories[id]],programStages[id,version,programStageSections[id],programStageDataElements[dataElement[id,optionSet[id,version]]]]";
        return $http.get(url).then(handleSuccess, handleError('Error loading data elements groups'));
    }
    home.getCharts = function(){
        var url = home.baseUrl+"/api/charts.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading favourite charts'));
    }
    home.getPageTemplates = function(orientation,page){
        var templates = "";
        if(page=="home"){

            if(orientation=="left"){
                templates = "views/menus/leftmenu.html";
            }

            if(orientation=="center"){
                templates = "views/partials/home.html";
            }

            if(orientation=="right"){
                templates = "views/menus/rightmenu.html";
            }

        }else{

            if(orientation=="left"){
                templates = "views/menus/leftmenu_cms.html";
            }
            if(orientation=="center"){
                templates = "views/partials/home_cms.html";
            }
            if(orientation=="right"){
                templates = "views/menus/rightmenu_cms.html";
            }

        }


        return templates;
    }

    home.getTabs = function(eventObject){
        return home.loadEvent(eventObject);
    }

    home.getDefaultPage = function(){
        if(!localStorage.getItem('defaultPage')){home.setDefaultPage('home')}
        return localStorage.getItem('defaultPage');
    }

    home.setDefaultPage = function(pageName){
        localStorage.setItem('defaultPage',pageName);
    }

    home.getTabContent = function(eventObject){
        return home.loadEvent(eventObject);
    }

    home.addTabContent = function(eventPayload){
        return home.saveEvent(eventPayload,'Error saving tab contents');
    }


    home.getMessages = function(){
        return home.loadMessages();
    }


    home.getExternalLinks = function(eventObject){
        return home.loadEvent(eventObject);
    }

    home.loadEvent = function(eventObject){
        var url = home.baseUrl+"/api/events.json?orgUnit="+home.parentOrganisationUnit+"&program="+eventObject.id+"&paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }

    home.loadMessages = function(){
        var url = home.baseUrl+"/api/messageConversations.json?fields=:all&page=1";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }

    home.retrieveSetting = function(){

        var url = home.baseUrl+"/api/systemSettings";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }


    home.getReportTables = function(){
        var url = home.baseUrl+"api/reportTables.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError("Error Loading favourites"));
    }

     home.getUsers = function(){
        var url = home.baseUrl+"/api/users.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading users'));
    }

    home.loggedUser = function(){
        var url = home.baseUrl+"/api/me.json";
        return $http.get(url).then(handleSuccess, handleError('Error loading logeged in user'));
    }

    home.processUsers = function(users){
        var finalUsers = []
       angular.forEach(users,function(user,index){
           user.icon = "<i class='fa fa-user'></i>";
           finalUsers.push(user);
       })

        return finalUsers;
    }


    return home;
}]);

homeServices.service('utilityService',function(){
    var utilityService = this;
    utilityService.prepareEventObject = function(assignedProgram){
        var eventObject = {id:assignedProgram.id};

        return eventObject;
    }

    utilityService.formatAnalysis = function(reportTable){
        var favourites = [{name:'Agriculture',indicators:[]},{name:'Livestock',indicators:[]},{name:'Fishery',indicators:[]},{name:'Trade',indicators:[]},{name:'General Information',indicators:[]}];
        angular.forEach(reportTable.reportTables,function(value){

            if(value.displayName.indexOf("Agriculture:")>=0){
                favourites[0].indicators.push(value);
            }
            if(value.displayName.indexOf("Fishery:")>=0){
                favourites[2].indicators.push(value);
            }
            if(value.displayName.indexOf("General Information:")>=0){
                favourites[4].indicators.push(value);
            }
            if(value.displayName.indexOf("Livestock:")>=0){
                favourites[1].indicators.push(value);
            }
            if(value.displayName.indexOf("Trade:")>=0){
                favourites[3].indicators.push(value);
            }
        });
        return favourites;
    }

    utilityService.refineTabs = function(events){
        var tabs = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            angular.forEach(eventValues.dataValues,function(eventValue,eventIndex){
                if(eventValue.value=="Agriculture"){
                    activeClass = "current";
                    contentClass = "show";
                }else{
                    activeClass = "";
                    contentClass = "hide";
                }
                tabs.push({event:eventValues.event,program:eventValues.program,programStage:eventValues.programStage,dataelement:eventValue.dataElement,value:eventValue.value,active:activeClass,content:contentClass})

            })

        });

        return tabs;
    }
    utilityService.refineTabContent = function(events){
        var content = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            var template = {id:eventValues.event,menu:utilityService.getValue('tz5ttCEyPhf',eventValues.dataValues),order:utilityService.getValue('JTvaqwY7kDy',eventValues.dataValues),content:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues)}
            content.push(template);
            })

        return content;

    }
    utilityService.refineMessage = function(message){
        var content = [];
        var activeClass = "";
        var contentClass = "";

        angular.forEach(message.messageConversations,function(messageValues,messageIndexs){
        //    var template = {from:utilityService.getValue('r7FUBZIK1iH',eventValues.dataValues),to:utilityService.getValue('Am2wAwoJdCV',eventValues.dataValues),subject:utilityService.getValue('QLfNQoTlAM9',eventValues.dataValues),body:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues),date:eventValues.created.substring(0,10)}
        //        angular.forEach(template,function(value,index){
        //            if(index == "from"){
        //                template[index] = eval("("+value+")");
        //            }
        //        });
            messageValues.created = messageValues.created.substring(0,10)
            content.push(messageValues);
            })
        //console.log(message.messageConversations);
        return content;

    }
    utilityService.refineExternalLinks = function(events){
        var content = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            var template = {url:utilityService.getValue('fNpPvw46Mxl',eventValues.dataValues),name:utilityService.getValue('cReJPO8bM6C',eventValues.dataValues),status:utilityService.getValue('CqGEDx5xw2Y',eventValues.dataValues)}
            content.push(template);
        })

        return content;

    }

    utilityService.getValue = function(element,arrayContainer){
        var value = "";
        angular.forEach(arrayContainer,function(elementObject,elementIndex){
            if(element==elementObject.dataElement){
                value = elementObject.value;
            }
        });

        return value;
    }

    return utilityService;
});

function handleSuccess(res){
    return res.data;
}

function handleError(error){
    return function () {
        return { success: false, message: error };
    };
}