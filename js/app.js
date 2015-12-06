/*global app, $on */
(function () {
	'use strict';

	function Person(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var person = new Person('persons-vanillajs');

	function setView() {
		person.controller.setView(document.location.hash);
	}
	
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
