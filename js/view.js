/*global qs, qsa, $on, $parent, $delegate */

(function (window) {
	'use strict';

	/**
	     * View that abstracts away the browser's DOM completely.
	     * It has two simple entry points:
	     *
	     *   - bind(eventName, handler)
	     *     Takes a person application event and registers the handler
	     *   - render(command, parameterObject)
	     *     Renders the given command with the options
	     */
	function View(template) {
		this.template = template;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;

		this.$personList = qs('.person-list');
		this.$newperson = qs('.new-person');
	}

	View.prototype._editItem = function (id, title) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		listItem.className = listItem.className + ' editing';

		var input = document.createElement('input');
		input.className = 'edit';

		listItem.appendChild(input);
		input.focus();
		input.value = title;
	};

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$personList.innerHTML = self.template.show(parameter);
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.title);
			},
		};

		viewCommands[viewCmd]();
	};

	View.prototype._itemId = function (element) {
		var li = $parent(element, 'li');
		return parseInt(li.dataset.id, 10);
	};

	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === 'newPerson') {
			$on(self.$newperson, 'change', function () {
				handler(self.$newperson.value);
			});

		} else if (event === 'itemEdit') {
			$delegate(self.$personList, 'li label', 'dblclick', function () {
				handler({id: self._itemId(this)});
			});

		}
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));
