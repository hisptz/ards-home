$(document).ready(function(){
	
	//multiselect
	
	
	var prefix = new Array();;
	var html = "";
	$('.periods').hide();
	$('input[name=change]').change(function(){
		if($(this).is(':checked')){
			if($(this).val() == 'adminunit'){
				$('.adminunit').fadeIn();
				$('.periods').fadeOut();
			}else if($(this).val() == 'periods'){
				$('.adminunit').fadeOut();
				$('.periods').fadeIn();
			}
		}
	});
	//getting a json structure for a selected report
	$.getJSON( "data/YTsHSYChmaD.json", function( data ) {
    //$.getJSON( "data/ZuznHGcadLF.json", function( data ) {
	//$.getJSON( "data/xqPftO3Y63K.json", function( data ) {
		var counter = 0;
		if(data.headers[1].name == "Period"){
			$.each( data.headers, function( key, value ) {
				counter++;
				if(value.hidden != true){
					if(counter > 2){prefix[prefix.length] = value.name.replace(/ /g,'');}
					var menu = value.name.replace(/ /g,'');
					window["temp_" + menu] = new Array();
					for (i = 0; i < data.rows.length-1; i++) { 
						if(value.type == "java.lang.Double"){
							window["temp_" + menu][window["temp_" + menu].length] = parseInt(data.rows[i][key]);
						}
						else{
							window["temp_" + menu][window["temp_" + menu].length] = data.rows[i][key];
						}
					}
				}
			})
		}else if(data.headers[1].name == "Organisation unit"){
			$.each( data.headers, function( key, value ) {
				if(value.hidden != true){
					prefix[prefix.length] = value.name.replace(/ /g,'');
					var menu = value.name.replace(/ /g,'');
					window["temp_" + menu] = new Array();
					for (i = 0; i < data.rows.length-1; i++) { 
						if(value.type == "java.lang.Double"){
							window["temp_" + menu][window["temp_" + menu].length] = parseInt(data.rows[i][key]);
						}
						else{
							window["temp_" + menu][window["temp_" + menu].length] = data.rows[i][key];
						}
					}
				}
			})
		}
		
		//******creating select items******
		var orgunit_select = "";
		var data_element_select = "";
		var periods = "";
		for (i = 0; i < temp_Organisationunit.length; i++) { 
			orgunit_select += "<option>"+temp_Organisationunit[i]+"</option>";
		}
		
		$('#my-select').html(orgunit_select);
		for (i = 0; i < temp_Period.length; i++) { 
			periods += "<option>"+temp_Period[i]+"</option>";
		}
		
		$('#periods').html(periods);
		
		for (i = 1; i < prefix.length; i++) { 
			data_element_select += "<option>" + prefix[i] + "</option>";
		}
		$('#my-select1').html(data_element_select);
		
		//******preparing multiselects to allow easy usage of analysis page******
		$('#my-select').multiSelect({
	  selectableHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  selectionHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  afterInit: function(ms){
		var that = this,
			$selectableSearch = that.$selectableUl.prev(),
			$selectionSearch = that.$selectionUl.prev(),
			selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
			selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

		that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
		.on('keydown', function(e){
		  if (e.which === 40){
			that.$selectableUl.focus();
			return false;
		  }
		});

		that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
		.on('keydown', function(e){
		  if (e.which == 40){
			that.$selectionUl.focus();
			return false;
		  }
		});
	  },
	  afterSelect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  },
	  afterDeselect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  }
	});
	$('#select-all').click(function(){
	$('#my-select').multiSelect('select_all');
	  return false;
	});
	$('#deselect-all').click(function(){
	  $('#my-select').multiSelect('deselect_all');
	  return false;
	});
	$('#my-select1').multiSelect({
	  selectableHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  selectionHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  afterInit: function(ms){
		var that = this,
			$selectableSearch = that.$selectableUl.prev(),
			$selectionSearch = that.$selectionUl.prev(),
			selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
			selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

		that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
		.on('keydown', function(e){
		  if (e.which === 40){
			that.$selectableUl.focus();
			return false;
		  }
		});

		that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
		.on('keydown', function(e){
		  if (e.which == 40){
			that.$selectionUl.focus();
			return false;
		  }
		});
	  },
	  afterSelect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  },
	  afterDeselect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  }
	});
	
	$('#select1-all').click(function(){
	$('#my-select1').multiSelect('select_all');
	  return false;
	});
	$('#deselect1-all').click(function(){
	  $('#my-select1').multiSelect('deselect_all');
	  return false;
	});
		
		
   	$('#periods').multiSelect({
	  selectableHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  selectionHeader: "<input type='text' class='search-input form-control input-sm' autocomplete='off' placeholder='Search'>",
	  afterInit: function(ms){
		var that = this,
			$selectableSearch = that.$selectableUl.prev(),
			$selectionSearch = that.$selectionUl.prev(),
			selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
			selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

		that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
		.on('keydown', function(e){
		  if (e.which === 40){
			that.$selectableUl.focus();
			return false;
		  }
		});

		that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
		.on('keydown', function(e){
		  if (e.which == 40){
			that.$selectionUl.focus();
			return false;
		  }
		});
	  },
	  afterSelect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  },
	  afterDeselect: function(){
		this.qs1.cache();
		this.qs2.cache();
	  }
	});
	$('#select2-all').click(function(){
	$('#periods').multiSelect('select_all');
	  return false;
	});
	$('#deselect2-all').click(function(){
	  $('#periods').multiSelect('deselect_all');
	  return false;
	});
	
	
	//drawing a table
	$('.gettable').click(function(){
		drawTable(data)
	});
	
	//drawing a line chart
	$('.line').click(function(){
		drawLine(data)
	});
	
	//drawing a pie chart
	$('.pie').click(function(){
		drawPie(data)
	});
	
	//drawing a column chart
	$('.column').click(function(){
		drawColumn(data)
	});
	
	//drawing a bar
	$('.bar').click(function(){
		drawBar(data)
	});
	
	
	//action buttons to generate various graphs
	$('.generate').click(function(){
		var condition =false;
		
		if($('.adminunit').is(":visible")){
			condition = ($('#my-select').val() == null || $('#my-select1').val() == null)
		}else if($('.periods').is(":visible")){
			condition = ($('#periods').val() == null || $('#my-select1').val() == null)
		}
		if(condition){
			alert('Select above options first');
		}else{
		 var orgunit = $('#my-select').val();
		 var dataelement = $('#my-select1').val();
		 var timeperiod = $('#periods').val();
		//******creating charts******
		var category = [];
		var series   = [];
		if($('.adminunit').is(":visible")){
			for (i = 0; i < orgunit.length; i++) { 
				category.push(orgunit[i])
			}
		}else if($('.periods').is(":visible")){
			for (i = 0; i < timeperiod.length; i++) { 
				category.push(timeperiod[i])
			}
		}
		
		for (i = 0; i < dataelement.length; i++) { 
			var kondoo = []
			for (k = 0; k < category.length; k++) { 
				kondoo.push(window["temp_"+dataelement[i]][k])
			}
			var temp ={ name: dataelement[i], data: kondoo };
			series.push(temp);
		}
		
		 $('#mainarea').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: data.title
            },
            xAxis: {
                categories: category,
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
            series: series
        });
	}
	})
	});
});
