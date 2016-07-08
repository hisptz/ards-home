/**
 * Created by kelvin Mbwilo on 8/17/14.
 */
function preparePeriods(first_period){
    var mounthList = "";
    var yearlist ="";
    var quarterList = "";
    var currentYear = new Date().getFullYear();
    for (var i= 0 ;i < 10 ;i++){
        //defining years
        var year = currentYear - i;
        var year1 = currentYear - (i+1);
        var financial = 'july '+year1+' june '+year;
        if($.inArray(year1+'July', first_period) == -1){
            yearlist += '<option value="'+year1+'July">'+financial+'</option>';
        }else{
            yearlist += '<option value="'+year1+'July" selected="selected">'+financial+'</option>';
        }

        //defining quarters
        if($.inArray(year+'Q1', first_period) != -1){
            quarterList += '<option value="'+year+'Q1" selected="selected">Jan to Mar '+year+'</option>';
            quarterList += '<option value="'+year+'Q2">Apr to Jun '+year+'</option>';
            quarterList += '<option value="'+year+'Q3">Jul to Sep '+year+'</option>';
            quarterList += '<option value="'+year+'Q4">Oct to Dec '+year+'</option>';
        }else if($.inArray(year+'Q2', first_period) != -1){
            quarterList += '<option value="'+year+'Q1">Jan to Mar '+year+'</option>';
            quarterList += '<option value="'+year+'Q2" selected="selected">Apr to Jun '+year+'</option>';
            quarterList += '<option value="'+year+'Q3">Jul to Sep '+year+'</option>';
            quarterList += '<option value="'+year+'Q4">Oct to Dec '+year+'</option>';
        }else if($.inArray(year+'Q3', first_period) != -1){
            quarterList += '<option value="'+year+'Q1">Jan to Mar '+year+'</option>';
            quarterList += '<option value="'+year+'Q2">Apr to Jun '+year+'</option>';
            quarterList += '<option value="'+year+'Q3" selected="selected">Jul to Sep '+year+'</option>';
            quarterList += '<option value="'+year+'Q4">Oct to Dec '+year+'</option>';
        }else if($.inArray(year+'Q4', first_period) != -1){
            quarterList += '<option value="'+year+'Q1">Jan to Mar '+year+'</option>';
            quarterList += '<option value="'+year+'Q2">Apr to Jun '+year+'</option>';
            quarterList += '<option value="'+year+'Q3">Jul to Sep '+year+'</option>';
            quarterList += '<option value="'+year+'Q4" selected="selected">Oct to Dec '+year+'</option>';
        }else{
            quarterList += '<option value="'+year+'Q1">Jan to Mar '+year+'</option>';
            quarterList += '<option value="'+year+'Q2">Apr to Jun '+year+'</option>';
            quarterList += '<option value="'+year+'Q3">Jul to Sep '+year+'</option>';
            quarterList += '<option value="'+year+'Q4">Oct to Dec '+year+'</option>';
        }

        //defining months
        if($.inArray(year+'01', first_period) != -1){
            mounthList += '<option value="'+year+'01" selected="selected">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'02', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02" selected="selected">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'03', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03" selected="selected">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'04', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04" selected="selected">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'05', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05" selected="selected">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'06', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06" selected="selected">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'07', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07" selected="selected">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'08', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08" selected="selected">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'09', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09" selected="selected">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'10', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10" selected="selected">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'11', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11" selected="selected">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }else if($.inArray(year+'12', first_period) != -1){
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12" selected="selected">December '+year+'</option>';
        }else{
            mounthList += '<option value="'+year+'01">January '+year+'</option>';
            mounthList += '<option value="'+year+'02">February '+year+'</option>';
            mounthList += '<option value="'+year+'03">March '+year+'</option>';
            mounthList += '<option value="'+year+'04">April '+year+'</option>';
            mounthList += '<option value="'+year+'05">May '+year+'</option>';
            mounthList += '<option value="'+year+'06">June '+year+'</option>';
            mounthList += '<option value="'+year+'07">July '+year+'</option>';
            mounthList += '<option value="'+year+'08">August '+year+'</option>';
            mounthList += '<option value="'+year+'09">September '+year+'</option>';
            mounthList += '<option value="'+year+'10">October '+year+'</option>';
            mounthList += '<option value="'+year+'11">November '+year+'</option>';
            mounthList += '<option value="'+year+'12">December '+year+'</option>';
        }

    }

    $('.periods').multiselect().multiselectfilter();

    $('#years').click(function(){
        $('.periodfilter button').removeClass('btn-success').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-success');
        $(".periods").multiselectfilter("destroy");
        $(".periods").multiselect("destroy");
        $('.periods').html(yearlist);
        $('.periods').multiselect().multiselectfilter();
    })
    $('#quarters').click(function(){
        $('.periodfilter button').removeClass('btn-success').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-success');
        $(".periods").multiselectfilter("destroy");
        $(".periods").multiselect("destroy");
        $('.periods').html(quarterList);
        $('.periods').multiselect().multiselectfilter();
    })
    $('#mounths').click(function(){
        $('.periodfilter button').removeClass('btn-success').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-success');
        $(".periods").multiselectfilter("destroy");
        $(".periods").multiselect("destroy");
        $('.periods').html(mounthList);
        $('.periods').multiselect().multiselectfilter();
    })
    $('.periods').css('width', '180px');
    $('#years').trigger('click')
}
