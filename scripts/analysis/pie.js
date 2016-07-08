function drawPie(title,url,category,dataArray){
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
        var seriess = [];
        if(category == 'ou'){
            for(var j =0 ;j<dataelements.length ;j++){
                var name = data.metaData.names[dataelements[j]];
                var datas = [];
                $.each( data.metaData.ou, function( key, value ) {
                    var tempseries = [];
                    $.each( data.rows, function( key, serie ) {
                        if(serie[0] == dataelements[j] && serie[1] == value ){
                            tempseries.push(name+' '+data.metaData.names[value])
                            tempseries.push(parseInt(serie[2]));
                            seriess.push(tempseries)
                        }
                    });
                })

                data_series.push({'name':name,'data':datas})
            }
        }else{
            for(var j =0 ;j<dataelements.length ;j++){
                var name = data.metaData.names[dataelements[j]];
                var datas = [];
                $.each( data.metaData.pe, function( key, value ) {
                    $.each( data.rows, function( key, serie ) {
                        if(serie[0] == dataelements[j] && serie[1] == value ){
                            datas.push(parseInt(serie[2]));
                        }
                    });
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
            plotBackgroundColor: null,
            plotShadow: false
        },
        title: {
            text: title+' ' +title_to_use
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
//                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: title,
            data: seriess
        }]
    });
    });
};

