/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @param {string} name The name of our DB we want to use
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				persons: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var persons = JSON.parse(localStorage[this._dbName]).persons;

		callback.call(this, persons.filter(function (person) {
			for (var q in query) {
				if (query[q] !== person[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).persons);
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var persons = data.persons;

		callback = callback || function () {};

		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < persons.length; i++) {
				if (persons[i].id === id) {
					for (var key in updateData) {
						persons[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, JSON.parse(localStorage[this._dbName]).persons);
		} else {
			// Generate an ID
			updateData.id = new Date().getTime();

			persons.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var persons = data.persons;

		for (var i = 0; i < persons.length; i++) {
			if (persons[i].id == id) {
				persons.splice(i, 1);
				break;
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, JSON.parse(localStorage[this._dbName]).persons);
	};

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		localStorage[this._dbName] = JSON.stringify({persons: []});
		callback.call(this, JSON.parse(localStorage[this._dbName]).persons);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
