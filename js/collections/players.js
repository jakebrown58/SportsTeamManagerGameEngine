/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Teams Collection
	// ---------------
	var Players = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.BBPlayer,
		localStorage: new Backbone.LocalStorage('player-bb'),

		getAll: function () {
			return this.models;
		}
	});

	app.players = new Players();
})();
