	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./index.html');
	});
};