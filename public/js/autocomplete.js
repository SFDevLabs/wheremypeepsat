$(document).ready(function () {

	var list = $('#list')
	var ajax = function(){
		var input = $("#search").val();
		$.ajax({
		  url: "/people/search",
		  data:{q:input},
		  context: document.body
		 }).done(function(data) {
		  	list.html("");
			$('[type=submit]').attr('disabled',true);
		  	data.forEach(function(val){

		  		var title = $('<p class="title">').text(val.firstname+' '+val.lastname)
		  		var tags = $('<p>').text(val.tags);
		  		var a = $('<a href="javascript:void(0);" class="auto-complete-click" >')
		  		a.data('item',val);
		  		a.on('click',clickFormFill);
		  		a.append(title)
		  		a.append(tags)
		  		var li =  $('<li class="edge-box">')
		  		li.append(a);
		  		list.append(li);	
		  	});
		  	if (data.length===0){
		  		p=$('<p>').text("No Results")
		  		li = $('<li class="edge-box">').append(p);
		  		list.append(li);
		  	}
		  	$('#spin').hide()
		});
	}

	 var clickFormFill = function(e){
		var data = $(this).data('item');
		$('[name=obj]').val(data._id);
		$('[name=title]').val(data.title);
		$('[type=submit]').removeAttr('disabled')
		$('.selected').removeClass('selected');
		$(this).closest('li').addClass('selected');
	}

	var time=0;
	 $("#search").keyup(function(e){
	 	if (time==0){
		 	time=300;
		 	counter();	 		
	 	}else{
	 		time=300;
	 	}
	 });
	 var counter = function(){
	 	$('#spin').show()
	 	setTimeout(function(){
	 		if (time<=0){
	 			ajax();
	 		}else{
	 			time=time-300
	 			counter();
	 		}
	 	},300);
	 }

	var opts = {
	  lines: 13, // The number of lines to draw
	  length: 10, // The length of each line
	  width: 5, // The line thickness
	  radius: 10, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#000', // #rgb or #rrggbb or array of colors
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: '50%', // Top position relative to parent
	  left: '50%' // Left position relative to parent
	};
	var target = document.getElementById('spin');
	window.spinner = new Spinner(opts).spin(target);
	$('#spin').hide()
	ajax();
});
