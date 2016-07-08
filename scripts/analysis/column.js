function drawColumn(title,url,category,dataArray){
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
                type: 'bar'
            },
            title: {
                text: title+' '+title_to_use
            },
            xAxis: {
                categories: series_to_use,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: data_series
        });
    });
}


