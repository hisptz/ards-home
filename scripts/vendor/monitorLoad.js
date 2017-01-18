/**
 * Created by leo on 5/1/15.modified 8/17/16
 */




var sendEvent = function (theObjects,ObjectNames,ObjectUrls,OrgUnitDimensions,PeriodDimensions,html_link){

    if(ObjectNames.indexOf('Entry Form')>=0){

    }else{

        var UsedBrowser =  getBrowserName(navigator);
        var OsUserrAgent=  navigator.platform;
        var IpAddress	=	window.IP;
        var Username	= 	"";
        var UserFullName=   "";
        var UserDutyPost=   "";
        var ObjectName  =   ObjectNames;
        var ObjectUrl   =   ObjectUrls;
        var theObject   =   theObjects;
        var RequestDateTime = null;
        var PeriodDimension = PeriodDimensions;

        var d = new Date();
        var curr_date	= d.getDate();
        var curr_month	= d.getMonth()+1;
        var curr_year 	= d.getFullYear();
        if(curr_month<10){
            curr_month="0"+curr_month;
        }
        if(curr_date<10){
            curr_date="0"+curr_date;
        }
        RequestDateTime = curr_year+"-"+curr_month+"-"+curr_date;
        var Org = null;
        var url="../../../api/me";
        $.get(url,function(data){
            var orgs = "";
            var i = 0;
            $.each(data.organisationUnits,function(orgIndex,orgvalue){
                orgvalue.name;
                if(i>0){orgs+=",";}
                orgs+=orgvalue.name;
                i++;
            });
            UserDutyPost = orgs;
            Org= data.organisationUnits[0].id;

            UserFullName = data.name;
            Username	 = data.userCredentials.username;



            /**
             * Preparing custom post function to handle addition of new even
             *
             * */
            $.getJSON( "https://jsonip.com",
                function(data){

                    var event= {
                        "program": "qxlSpGyl4zR",
                        "orgUnit": Org,
                        "eventDate": RequestDateTime,
                        "status": "COMPLETED",
                        "coordinate": {
                            "latitude": "",
                            "longitude": ""
                        },
                        "dataValues": [
                            { "dataElement": "aE2UyhC6v7X", "value": theObject },
                            { "dataElement": "KuGT4AJioD9", "value": ObjectName },
                            { "dataElement": "SH14MRy9pSZ", "value": ObjectUrl },
                            { "dataElement": "ulKVzFSbkry", "value": OrgUnitDimensions },
                            { "dataElement": "hjCMP7fuJSD", "value": PeriodDimension },
                            { "dataElement": "llt41wFPtcf", "value": Username },
                            { "dataElement": "LzbzZftlSAa", "value": UserFullName },
                            { "dataElement": "mgtwnvohcow", "value": UserDutyPost },
                            { "dataElement": "atwoYgdxvgg", "value": OsUserrAgent },
                            { "dataElement": "N6x8L5LAp6o", "value": window.IP },
                            { "dataElement": "UvEng3cCnhS", "value": RequestDateTime },
                            { "dataElement": "IcsZOKnNtBX", "value": UsedBrowser }
                        ]
                    };
                    $.ajax({
                        url:'../../../api/events',
                        type:'POST',
                        data:JSON.stringify(event),
                        contentType:'application/json; charset=utf-8',
                        dataType:"json",
                        success: function(response){
                            console.log(event);
                        }
                    });

                }
            ).done(function() {

                })
                .fail(function() {
                    var event= {
                        "program": "qxlSpGyl4zR",
                        "orgUnit": Org,
                        "eventDate": RequestDateTime,
                        "status": "COMPLETED",
                        "storedBy":Username,
                        "coordinate": {
                            "latitude": "",
                            "longitude": ""
                        },
                        "dataValues": [
                            { "dataElement": "aE2UyhC6v7X", "value": theObject },
                            { "dataElement": "KuGT4AJioD9", "value": ObjectName },
                            { "dataElement": "SH14MRy9pSZ", "value": ObjectUrl },
                            { "dataElement": "ulKVzFSbkry", "value": OrgUnitDimensions },
                            { "dataElement": "hjCMP7fuJSD", "value": PeriodDimension },
                            { "dataElement": "llt41wFPtcf", "value": Username },
                            { "dataElement": "LzbzZftlSAa", "value": UserFullName },
                            { "dataElement": "mgtwnvohcow", "value": UserDutyPost },
                            { "dataElement": "atwoYgdxvgg", "value": OsUserrAgent },
                            { "dataElement": "N6x8L5LAp6o", "value": "" },
                            { "dataElement": "UvEng3cCnhS", "value": RequestDateTime },
                            { "dataElement": "IcsZOKnNtBX", "value": UsedBrowser }
                        ]
                    };

                    $.postJSON('../../../api/events',event,function(response){
                        console.log("event added");
                    },function(response){
                        console.log("no event added");
                    });

                })



        });



    }



}

function checkOptionSet(theObject,otpionSetName){
    var urlOptionset = "../../../api/optionSets.json?filter=name:eq:"+otpionSetName+"&paging=false";
    $.postJSON = function(url, data, callback,failureCallback) {
        return jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'admin':'district'
            },
            'type': 'POST',
            'url': url,
            'data': JSON.stringify(data),
            'dataType': 'json',
            'success': callback,
            'failure':failureCallback
        });
    };


    $.getJSON(urlOptionset,
        function(resultOptioset){
            var optionSetId = resultOptioset.optionSets[0].id;
            var urlOptions = '../../../api/optionSets/'+optionSetId+'/options.json?paging=false&fields=name';
            $.getJSON(urlOptions,
                function(resultOptios){

                    var count = resultOptios.length;
                    var i = 0;
                    $.each(resultOptios.options,function(indexOptions,valueOptions){
                        if(valueOptions.name==theObject){
                            i++;
                        }

                    });
                    if(i==0){
                        var urlAddOptions = '../../../api/options.json';
                        $.postJSON(urlAddOptions,{'name':theObject,'code':theObject},function(result){
                            var urlAddOptions = "../api/optionSets/"+optionSetId+"/options/"+result.lastImported;
                            $.postJSON(urlAddOptions,function(result){
                            });

                        });
                    }
                });
        });

}

var getBrowserName = function(navig){
    var nVer = navig.appVersion;
    var nAgt = navig.userAgent;
    var browserName  = navig.appName;
    var fullVersion  = ''+parseFloat(navig.appVersion);
    var majorVersion = parseInt(navig.appVersion,10);
    var nameOffset,verOffset,ix;

// In Opera 15+, the true version is after "OPR/"
    if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+4);
    }
// In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
// In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
// In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
// In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
// In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
// In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navig.appName;
        }
    }

    return browserName+" ( "+fullVersion+" )";
}

/**
 *
 * Various click functions for logging user activities
 *
 * */

function monitorLoadedPage(){

    var html_link = window.location.pathname;
    var theObject = null;
    var objectName = null;
    var objectUrl = null;
    var orgUnitDimension = null;
    var period = null;
    var object = $("a[href='.."+html_link+"']");
    if(object.attr("href")!=="undefined"){
        if(html_link.indexOf("Form.action")>0||html_link.indexOf("ReportForm")>0){
            objectName = $("a[href='"+html_link.split("/")[(html_link.split("/").length-1)]+"']").text();
        }else{
            objectName = $(object).text();
        }
        theObject = "Page";
        objectUrl = html_link;

    }else{

    }

    sendEvent(theObject,objectName,objectUrl,orgUnitDimension,period,html_link);
}




function monitorLoadedReport(){


    var theObject = null;
    var objectName = null;
    var objectUrl = null;
    var orgUnitDimension = null;
    var period = null;
    var html_link = "";
    $("input[value='Get report']").bind("click",function(){
        sendGetReportEvent();
    });
    $("input[value='Print'],input[value='Download as PDF']").bind("click",function(){

        objectName = $("select#dataSetId").find("option[value='"+dhis2.dsr.currentDataSetReport['ds']+"']").text();
        period = dhis2.dsr.currentDataSetReport['pe'];
        orgUnitDimension = dhis2.dsr.currentDataSetReport['ou'];
        theObject = "Report Download";

        sendEvent(theObject,objectName,objectUrl,orgUnitDimension,period,html_link);

    });


}
function sendGetReportEvent(){
    console.log("Sending Report Event");
    var objectName = $("select#dataSetId").find("option[value='"+dhis2.dsr.currentDataSetReport['ds']+"']").text();
    var period = dhis2.dsr.currentDataSetReport['pe'];
    var orgUnitDimension = dhis2.dsr.currentDataSetReport['ou'];
    var theObject = "Report View";

    sendEvent(theObject,objectName,objectUrl,orgUnitDimension,period,html_link);
}
function monitorDataEntry(){
    var theObject = null;
    var objectName = null;
    var objectUrl = null;
    var orgUnitDimension = null;
    var period = null;
    var html_link = "";
    $("select#selectedPeriodId").bind("change",function(){
        theObject = "Page";
        orgUnitDimension = dhis2.de.currentOrganisationUnitId;
        objectName = $("select option[value='"+$('#selectedDataSetId' ).val()+"']").text();
        period = $( '#selectedPeriodId' ).val();
        sendEvent(theObject,objectName,objectUrl,orgUnitDimension,period,html_link);
    });

}