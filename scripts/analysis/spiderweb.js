/**
 * Created by kelvin Mbwilo on 8/18/14.
 */
function drawSpider(title,url,category,dataArray){
    $.getJSON( url, function( data ) {
        var dataelements =new Array();
        for (var i = 0; i < dataArray.length; i++) {
            dataelements[i] = dataArray[i];
        }

        //creating orgunit title
        var orgunit_title ="";
        var orgunit_series= [];
        var data_series = [];
        $.each( data.metaData.ou, function( key, value ) {
            orgunit_title += data.metaData.names[value]+',';
            orgunit_series.push(data.metaData.names[value]);
        });

        //creating data series
        if(category == 'ou'){
            for(var j =0 ;j<dataelements.length ;j++){
                var name = data.metaData.names[dataelements[j]];
                var datas = [];
                $.each( data.metaData.ou, function( key, value ) {
                    var val = 0;
                    $.each( data.rows, function( key, serie ) {
                        if(serie[0] == dataelements[j] && serie[1] == value ){
                            val = serie[2]
                        }
                    });
                    datas.push(parseInt(val));
                })
                data_series.push({'name':name,'data':datas})
            }
        }else{
            for(var j =0 ;j<dataelements.length ;j++){
                var name = data.metaData.names[dataelements[j]];
                var datas = [];
                $.each( data.metaData.pe, function( key, value ) {
                    var val = 0;
                    $.each( data.rows, function( key, serie ) {
                        if(serie[0] == dataelements[j] && serie[1] == value ){
                            val = serie[2]
                        }
                    });
                    datas.push(parseInt(val));
                })
                data_series.push({'name':name,'data':datas})
            }
        }

        //creating period title
        var period_title ="";
        var period_series= [];
        $.each( data.metaData.pe, function( key, value ) {
            period_title += data.metaData.names[value]+',';
            period_series.push(data.metaData.names[value]);
        });

        //creating series
        var series_to_use = (category == 'pe')?period_series:orgunit_series
        var title_to_use = (category == 'pe')?orgunit_series:period_series
        console.log(data_series);
        $('#mainarea').highcharts({

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: title+' '+title_to_use,
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: series_to_use,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            series: data_series

        });
    });
}

