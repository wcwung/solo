var app;

$(function() {
	app = {
		server: '/userdata',

		init: function() {
			app.fetch();
			console.log("in init()");
		},

		fetch: function() {
			$.ajax({
				url: app.server,
				type: 'GET',
				contentType: 'application/json',
				success: function(data) {
					console.log("Fetched Fitbit Data");
					$steps = $('#steps');
					$distance = $('#distance');
					var steps = data.user["_json"].best.total.steps.value;
					var distance =  data.user["_json"].best.total.distance.value; 
					
					var steps = steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					$('<h1>' + steps + ' steps today' + '</h1>').appendTo($steps);

					$('<h1>' + distance.toFixed(1) + ' miles' + '</h1>').appendTo($distance);

					console.log(steps);
					console.log(data.user["_json"]);
				},
				error: function(data) {
					console.error('Failed to get data');
				}
			});
		}
	}

/* Fin */
});


