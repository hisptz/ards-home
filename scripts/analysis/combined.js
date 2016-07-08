/**
 * Created by kelvin Mbwilo on 8/18/14.
 */
function drawCombined(title,url,category,dataArray){
    $.getJSON( url, function( data ) {
        var dataelements =new Array();
        for (var i = 0; i < dataArray.length; i++) {
            dataelements[i] = dataArray[i];
        }

        //creating orgunit title
        var orgunit_title ="";
        var orgunit_series= [];
        var data_column = [];
        var data_line = [];
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
                data_column.push({type: 'column','name':name,'data':datas});
                data_line.push({type: 'spline','name':name,'data':datas})
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
                data_column.push({type: 'column','name':name,'data':datas});
                data_line.push({type: 'spline','name':name,'data':datas})
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
        $('#mainarea').highcharts({
            title: {
                text: title +' '+title_to_use
            },
            xAxis: {
                categories: series_to_use
            },
            labels: {
                items: [{
                    html: title,
                    style: {
                        left: '50px',
                        top: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            series: data_column.concat(data_line)
        });
    });
}

