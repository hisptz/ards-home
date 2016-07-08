function drawTable(title,url,category,dataArray){
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
        var period_series= [];
        $.each( data.metaData.pe, function( key, value ) {
            period_title += data.metaData.names[value]+',';
            period_series.push(data.metaData.names[value]);
        });
        var title_to_use = (category == 'pe')?orgunit_series:period_series
        //creating data series
        var table ='<h3 class="text-center" style="color:black;font-size:16px;font-weight:bold;fill:black;font-family: LiberationSansRegular, arial, sans-serif;">'+title+' '+title_to_use+'</h3>'
        table += '<table class="table table-bordered table-responsive" id="example">';
        var theads = "<thead></thead><tr><th></th>";
        var rows = "";
        for(var j =0 ;j<dataelements.length ;j++){
            var name = data.metaData.names[dataelements[j]];
            theads += '<th>'+name+'</th>';
        }
        if(category == 'ou'){
            $.each( data.metaData.ou, function( key, value ) {
                rows += '<tr>';
                rows += '<td>'+data.metaData.names[value]+'</td>'
                for(var j =0 ;j<dataelements.length ;j++){
                    rows += '<td>';
                    $.each( data.rows, function( key, serie ) {
                            if(serie[1] == value && serie[0] == dataelements[j]){
                                rows += serie[serie.length -1 ];
                            }else{
                                rows += '';
                            }
                    });
                    rows += '</td>'
                }
                rows += '</tr>'
            })
        }else{
            $.each( data.metaData.pe, function( key, value ) {
                rows += '<tr>';
                rows += '<td>'+data.metaData.names[value]+'</td>'
                for(var j =0 ;j<dataelements.length ;j++){
                    rows += '<td>';
                    $.each( data.rows, function( key, serie ) {
                        if(serie[1] == value && serie[0] == dataelements[j]){
                            rows += serie[serie.length -1];
                        }else{
                            rows += '';
                        }
                    });
                    rows += '</td>'
                }
                rows += '</tr>'
            })
        }
        theads += '</tr></thead>'
        table += theads+'<tbody>'+rows+'</tbody></table>'

        //creating period title
        var period_title ="";
        var period_series= [];
        $.each( data.metaData.pe, function( key, value ) {
            period_title += data.metaData.names[value]+',';
            period_series.push(data.metaData.names[value]);
        });

        //creating series
        $('#mainarea').html(table);
    });
}
