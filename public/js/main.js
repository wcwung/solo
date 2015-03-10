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
					var name = data.user.displayName;
					var user = data.user["_json"].user;
					console.log("Name: ", name);
					console.log(user.dateOfBirth);
				},
				error: function(data) {
					console.error('Failed to get data');
				}
			});
		}
	}

/* Fin */
});


