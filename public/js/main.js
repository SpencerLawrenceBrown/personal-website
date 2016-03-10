require.config({
	paths:{
		jquery: "../js/vendor/jquery-2.2.1.min"
	}
});

require(["jquery"], function($){

	var colors = ["#3D828C","#3A0B9A","#BF362A","#79BD8F","#8E2800","#FD7400","#FFE11A","#004358","#FF9E9D"];
	
	//Once the document loads, if its the home page, load the current experiment
	$(document).ready(function(){
		if(document.getElementById("experiment_wrapper")){
			$.get("/getEvernote", function(response){
				$("#evernote_experiment").html(response);
			});
		}
		var randomColor = Math.floor(Math.random() * colors.length);
		console.log(randomColor);
		$("#name_middle").css("color", colors[randomColor]);
	});
});