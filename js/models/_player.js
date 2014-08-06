/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Player Model
	// ----------
	app.BBPlayer = Backbone.Model.extend({
		myAttributes: {},
		player: {},

		hydro: function (player) {
			var self = this;
			self.player = player;
		},

		deleteMe: function () {
			delete this.player;
			
		},

		getActionText: function () {
			var self = this,
				actionButtonText = '',
				playerTeam = app.teams.getPlayerTeam();

			if (!self.attributes.teamName) {
				actionButtonText = 'Sign';
			} else {
				if (playerTeam.attributes.name === self.attributes.teamName) {
					actionButtonText = 'Release';
				}
			}

			return actionButtonText;
		},

		getPower: function () {
			return this.player.getPower();
		},

		getSubPower: function (key) {
			return this.player.getSubPower(key);
		},

		getAttributes: function () {
			return this.player.getAttributes();
		},

		getName: function () {
			return this.player.getName();
		},

		getPosition: function () {
			return this.player.getPosition();
		},

		getAge: function () {
			return this.player.getAge();
		},

		getExperience: function () {
			return this.player.getAge() - 20;
		},

		age: function () {
			return this.player.age();
		}
	});
}());
