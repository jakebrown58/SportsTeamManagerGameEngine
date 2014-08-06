/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    app.PlayerBuilder = function () {
        var numberOfNewPlayers =  app.teams.getEmptyRosterSpotCount() * 2 + app.globalConfig.teamCount * 2,
            j = 0,
            mp1,
            x;

        for (j = 0; j < numberOfNewPlayers; j = j + 1) {
            x = new app.Player(true);
            x.generate(true, true);
            mp1 = new app.BBPlayer();
            mp1.hydro(x);
            app.players.push(mp1);
        }
    };

    app.TeamBuilder = function () {
        var playerCount = 0,
            teamCount = app.globalConfig.teamCount,
            freeAgentcount = app.globalConfig.teamCount * (app.globalConfig.playersPerTeam - 1 ) * 2 + 55,
            teamNames = ['Antelopes', 'Bears', 'Crickets', 'Dolphins', 'Elephants', 'Falcons', 'Gulls', "Hawks",
                        'Archdukes', 'Barons', 'Counts', 'Dutchmen', 'Earls', 'Knights', 'Guards', 'Halbrediers'],
            i = 0,
            j = 0,
            x,
            mp1;

        if (teamCount % 2 === 1) {
            app.globalConfig.teamCount = app.globalConfig.teamCount + 1;
            teamCount = app.globalConfig.teamCount;
        }

        _(freeAgentcount).times( function() {
            var x = new app.Player(),
                mp1 = new app.BBPlayer();
            mp1.hydro(x);
            app.players.push(mp1);
        });

        for (i = 0; i < teamCount; i = i + 1) {
            app.teams.add(new app.Team());
            app.teams.models[i].init();
            app.teams.models[i].attributes.name = teamNames[i];

            for (j = 0; j < playerCount; j++) {
                x = new player();
                mp1 = new app.BBPlayer();
                mp1.hydro(x);
                app.players.push(mp1);

                app.teams.models[i].signPlayer(mp1);
            }
        }

        app.teams.setPlayerTeam(app.teams.models[0]);
    };
}());