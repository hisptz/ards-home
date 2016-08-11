/* global angular, dhis2 */

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
        var url = "../../../api/organisationUnits.json?paging=false&&filter=level:eq:1";
        return $http.get(url).then(handleSuccess, handleError('Error loading parent org unit groups'));
    }


    home.getPrograms = function(){
        var url = "../../../api/programs.json?filter=programType:eq:WITHOUT_REGISTRATION&filter=name:ilike:home&&paging=false&fields=id,name,version,categoryCombo[id,isDefault,categories[id]],programStages[id,version,programStageSections[id],programStageDataElements[dataElement[id,optionSet[id,version]]]]";
        return $http.get(url).then(handleSuccess, handleError('Error loading data elements groups'));
    }
    home.getCharts = function(){
        var url = "../../../api/charts.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading favourite charts'));
    }

    home.uploadDocument = function(file){

        var url = "../../../api/fileResources";
        return $http({method:'POST',headers: {  'Content-Type'  : 'multipart/form-data'},data:file,url:url}).then(handleSuccess, handleError("Error storing file"));
    }

    home.addExternalLink = function(links,newLink){
        // save document to storage

        links.push(newLink);
        var externalinks = [];
        angular.forEach(links,function(linkValue,linkIndex){
            externalinks.push({marker:"<i class='fa fa-globe'></i>",name:linkValue.name,url:linkValue.url,hidden:false});

        });

        var url = "../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'POST',data:externalinks,url:url}).then(handleSuccess, handleError("Error storing external links"));
    }


    home.updateExternalLink = function(links){
        var externalinks = [];
        angular.forEach(links,function(linkValue,linkIndex){
            externalinks.push({marker:"<i class='fa fa-globe'></i>",name:linkValue.name,url:linkValue.url,hidden:linkValue.hidden});

        });

        var url = +"../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'PUT',data:externalinks,url:url}).then(handleSuccess, handleError("Error  updating external links"));
    }


    home.listExternalLink = function(){

        var url = "../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error list external links"));
    }


    home.getDocuments = function(charts){
        // save document to storage
        var documents = [];
        var url = "../../../api/dataStore/documentStorage/documents";
        return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error getting documents"));
    }


    home.hideDocument = function(documentId){
        // save document to storage
        var documents = [];

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error hiding documents"));
    }


    home.showDocument = function(documentId){
        // save document to storage
        var documents = [];

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error sho documents"));
    }


    home.removeDocument = function(charts){
        // save charts to storage
        var documents = [];

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error remove documents"));
    }


    home.saveCharts = function(charts){
        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){
            modifiedCharts.push({id:chartValue.id,name:chartValue.displayName});
        });

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'POST',data:modifiedCharts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }


    home.saveSelectedCharts = function(charts){
        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){

            modifiedCharts.push({id:chartValue.id,name:chartValue.displayName});
        });
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'POST',data:modifiedCharts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }

    home.refineCharts = function(charts){
        var newCharts = [];
        angular.forEach(charts,function(newChart,oldChart){

            newCharts.push(eval("("+newChart+")"));
            newCharts.push(JSON.parse((newChart)));
        });
        return newCharts;
    }


    home.updateSelectedCharts = function(charts){

        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){

            modifiedCharts.push({icon:"<i class='fa fa-chart'></i>",id:chartValue.id,name:chartValue.displayName,ticked:true});
        });

        //var url = "../../../api/dataStore/chartsStorage/availableCharts";
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'PUT',data:charts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
        //return $http({method:'DELETE',url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }

    home.getSelectedCharts = function(charts){
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'GET',data:charts,url:url}).then(handleSuccess, handleError("Error getting charts"));
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
                templates = "views/menus/leftmenu_home.html";
            }
            if(orientation=="center"){
                templates = "views/partials/home_home.html";
            }
            if(orientation=="right"){
                templates = "views/menus/rightmenu_home.html";
            }

        }


        return templates;
    }

    home.getTabs = function(){
        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error getting tabs"));
    }

    home.getDefaultPage = function(){
        if(!localStorage.getItem('defaultPage')){home.setDefaultPage('home')}
        return localStorage.getItem('defaultPage');
    }

    home.setDefaultPage = function(pageName){
        localStorage.setItem('defaultPage',pageName);
    }

    home.addTab = function(modifiedTabs){

        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'POST',data:modifiedTabs,url:url}).then(handleSuccess, handleError("Error storing new tabs"));
    }
    home.updateTab = function(modifiedTabs){

        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'PUT',data:modifiedTabs,url:url}).then(handleSuccess, handleError("Error storing update tabs"));
    }

    home.getTabContent = function(){

        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error getting tab contents"));
    }

    home.addTabContent = function(tabContents){
        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'POST',data:tabContents,url:url}).then(handleSuccess, handleError("Error storing tab contents"));
    }


    home.updateTabContent = function(tabContents){
        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'PUT',data:tabContents,url:url}).then(handleSuccess, handleError("Error updating tab contents"));
    }

    home.getMessages = function(){
        return home.retrieveSetting();
    }

    home.addMessage = function(settingObject){

        return home.postSettings(settingObject);
    }

    home.deleteMessage = function(messageId){
        home.deleteSetting(messageId);
    }

    home.loadEvent = function(eventObject){
        var url = "../../../api/events.json?orgUnit="+home.parentOrganisationUnit+"&program="+eventObject.id+"&paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }


    home.loadChartStorage = function(){

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }

    home.loadInformations = function(){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http.get(url).then(handleSuccess, handleError("Error loading Information sharing"));
    }

    home.addInformations = function(dataArray){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http({method:'POST',data:dataArray,url:url}).then(handleSuccess, handleError("Error storing adding information sharing"));

    }


    home.updateInformations = function(dataArray){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http({method:'PUT',data:dataArray,url:url}).then(handleSuccess, handleError("Error storing adding information sharing"));

    }



    home.retrieveSetting = function(){

        var url = "../../../api/systemSettings";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }


    home.postSettings = function(dataObject){
        var url = "../../../api/systemSettings";
        return $http({method:'POST',data:dataObject,url:url}).then(handleSuccess, handleError(""));
    }

    home.deleteSetting = function(data){
        var url = "../../../api/systemSettings/"+data;
        return $http({method:'DELETE',url:url}).then(handleSuccess, handleError(""));
    }

    home.saveEvent = function(eventPayload,errorMessage){
        var url = "../../../api/events";
        return $http({
            method: 'POST',
            url: url,
            data:eventPayload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    home.updateEvent = function(eventPayload,data,eventId,errorMessage){
        var url = "../../../api/events/"+eventId;

        var payload = {
            "program":eventPayload.program,
            "orgUnit": home.parentOrganisationUnit,
            "eventDate": "2013-05-17",
            "dataValues":
            data

        }
        return $http({
            method: 'PUT',
            url: url,
            data:payload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    home.deleteEvent = function(eventId,errorMessage){
        var url = "../../../api/events/"+eventId;
        return $http.delete(url).then(handleSuccess, handleError(errorMessage));
    }

    home.getReportTables = function(){
        var url = "../../../api/reportTables.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError("Error Loading favourites"));
    }

    home.getUsers = function(){
        var url = "../../../api/users.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading users'));
    }

    home.loggedUserRole = function(){
        var url = "../../../api/me/authorization.json";
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
            var template = {id:eventValues.event,menu:utilityService.getValue('tz5ttCEyPhf',eventValues.dataValues),order:utilityService.getValue('JTvaqwY7kDy',eventValues.dataValues),content:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues),shown:utilityService.getValue('xiXnJ2aTlzz',eventValues.dataValues)}
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

    utilityService.getValue = function(element,arrayContainer){
        var value = "";
        angular.forEach(arrayContainer,function(elementObject,elementIndex){
            if(element==elementObject.dataElement){
                value = elementObject.value;
            }
        });

        return value;
    }
    utilityService.prepareReportTables = function(reportTables){

        // order the ards menus as required
        var mainmenu = new Array();
        var menuarr = ["Agriculture","Livestock","Fishery","Trade","General Information"];
        var arrayCounter = 0;
        angular.forEach( reportTables, function( value, key ) {
            var arr = value.displayName.split(':');
            if(arr.length > 1){
                if($.inArray(arr[0], menuarr) == -1){
                    var len = menuarr.length -1;
                    menuarr[len] = arr[0];
                    menuarr[menuarr.length] = "General Information";
                    mainmenu[arrayCounter] = arr[0];
                    arrayCounter++;
                }
            }
        });
        return menuarr;
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