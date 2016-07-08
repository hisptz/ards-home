/**
 * Created by kelvin Mbwilo on 8/18/14.
 */
function drawStaked(title,url,category,dataArray){
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
        $('#mainarea').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: title+' '+title_to_use
            },
            xAxis: {
                categories: series_to_use
            },
            yAxis: {
                min: 0,
                title: {
                    text: title
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            },
            series: data_series
        });

    });
}

