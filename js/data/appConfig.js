/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.globalConfig = {
		teamCount: 4,
		playersPerTeam: 8,
		activePlayersPerTeam: 4,
		numberOfAttributes: 5,
		seasonLength: 20,
		volatility: 4,
		retirementAge: 38,
		players: {
			playerRisingAge: 24,
			playerDropOffAge: 33,
			playerRiseProb: 30,
			playerDropProb: 35,
			initialAce: 60,
			initialStar: 92,
			postAce: 77,
			postStar: 93
		},
		positions: [
			{name: 'Leader', activeLimit: 1, rosterLimit: 2},
			{name: 'Defense', activeLimit: 2, rosterLimit: 3},
			{name: 'Offense', activeLimit: 2, rosterLimit: 3}
		]
	};
}());