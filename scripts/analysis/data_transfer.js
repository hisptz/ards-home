$(document).ready(function(){
	 var html = "";
	 $.getJSON( "b3xPviE2fk8.json", function( data ) {
		 
		 html += "<h4>"+data.name+"</h4>";
		 html += "<div class='row'><div class='col-sm-6'>Table Name :<br><input type='text' class='form-control' /></div></div>";
		 html += "<h4>Categories</h4>";
		 $.getJSON( data.categoryCombo.id+".json", function( category ) {
			 html += "<h4>"+category.name+"</h4>";
			 $.each( category.categoryOptionCombos, function( key, value ) {
				 html += "<div class='row' style='padding-bottom:5px'>";
				 html += "<h5 style='padding:3px'>" + value.name + "</h5>";
				 html += "<div class='col-sm-3'>";
				 html += "Column <br/>";
				 html += "<input type='text' class='form-control'/>";
				 html += "</div>";
				 html += "<div class='col-sm-3'>";
				 html += "Key Column <br/>";
				 html += "<input type='text' class='form-control'/>";
				 html += "</div>";
				 html += "<div class='col-sm-3'>";
				 html += "Key Column Value <br/>";
				 html += "<input type='text' class='form-control'/>";
				 html += "</div>";
				 html += "<div class='col-sm-3'>";
				 html += "<br/>";
				 html += "<input type='submit' class='btn btn-info btn-sm'/>";
				 html += "</div>";
				 html += "</div>";
			 });
			 $("#mainarea").html(html);
		 });
		 
	 });
	 
});
