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
					$steps = $('#steps-count');
					$distance = $('#distance');
					$floors = $('#floors');
					var steps = data.user["_json"].best.total.steps.value;
					var distance =  data.user["_json"].best.total.distance.value; 
					var floors = data.user["_json"].best.total.floors.value; 

					var steps = steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					$('<h1>' + steps + ' steps' + '</h1>').appendTo($steps);

					$('<h1>' + distance.toFixed(1) + ' miles' + '</h1>').appendTo($distance);

					$('<h1>' + floors.toFixed(1) + ' floors' + '</h1>').appendTo($floors);
					console.log(steps);
					console.log(data.user["_json"]);
					console.log(data);
				},
				error: function(data) {
					console.error('Failed to get data');
				}
			});
		},

	bodyStats: {
		name: 'William',
		age: 23,
		weight: 156,
		height: "5'10",
		bloodType: 'A-',
		heartRate: 76,
		bodyFat: '19.8%'
	}
	// /app	
	}
var date = moment().format("MMMM D");
$('<h3>' + date + '</h3>').appendTo('#date-today');
console.log(date);

(function updateTime(){ 
    var now = moment().format('h:mm:ss A');
    $('#now').text(now);
    setTimeout(updateTime, 1000);
})();

$('.weight').text(app.bodyStats.weight + " lbs");
$('.height').text(app.bodyStats.height + " ft");
$('.blood').text(app.bodyStats.bloodType);
$('.heart').text(app.bodyStats.heartRate + " bpm");
$('.age').text(app.bodyStats.age)
$('.fat').text(app.bodyStats.bodyFat);


/* Fin */
});


