/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Teams Collection
	// ---------------
	var Teams = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Team,

        playerTeam: "",

        init: false,
        freeAgents: "",
        draftState: "",
        showAction: "",

		localStorage: new Backbone.LocalStorage('teams-bb'),

        handleSign: function (config) {
            var self = this,
                action = config.action,
                player = config.player,
                draftOrder = self.models;

            if (action === 'release') {
                self.getPlayerTeam().releasePlayer(player);
                app.draftManager.refresh();
                return;
            }

            if (self.draftState === "") {
                if( app.seasonHistory && app.seasonHistory.getFinishOrder) {
                    draftOrder = app.seasonHistory.getFinishOrder();
                    if (draftOrder) {
                        draftOrder = self.convertNameListToTeams(draftOrder.reverse());
                    } else {
                        draftOrder = self.models;
                    }
                }
                app.draftManager.startDraft(self.freeAgents, draftOrder, self.getPlayerTeam());
                self.draftState = "started";
            }

            if(!app.teams.getPlayerTeam().canSignPlayer(player)) {
                return;
            }

            if(app.draftManager.getNextChooser() === self.getPlayerTeam()){
                app.teams.getPlayerTeam().signPlayer(player);
                app.draftManager.logPick(self.getPlayerTeam(), player);
            }

            app.draftManager.autoRun();
            app.draftManager.refresh();
            

            if (self.areAllTeamsFull()) {
                self.draftState = "";
            }
        },

        releasePlayer: function (player) {
            var self = this,
                team;

            team = _.filter(self.getTeams(), function (itm) {return itm.getName() === player.attributes.teamName; });

            if (team.length > 0) {
                if (team[0].getName() !== self.getPlayerTeam().getName()) {
                    team[0].releasePlayer(player);
                }
            }
        },

        handleShowSeason: function (action) {
            var self = this;
            self.showAction = action;
            return;
        },

        areAllTeamsFull: function () {
            var self = this,
                z = self.models.length,
                playerTeam = self.getPlayerTeam();
            for (z = 0; z < self.models.length; z = z + 1) {
                if (!self.models[z].isFull()) {
                    return false;
                }
            }

            return true;
        },

        fillTeams: function () {
            //var self = this;
            app.draftManager.pruneTeams();
            app.draftManager.fillTeams();
        },

        getFreeAgents: function () {
            var self = this;
            if (self.freeAgents === "") {
                self.freeAgents = new app.FreeAgentPool();
            }
            return self.freeAgents;
        },

        getTeams: function () {
            return this.models;
        },

        convertNameListToTeams: function (list) {
            var self = this,
                teams = [],
                matches;

            _.each(list, function(listItm) {
                matches = _.filter(self.models, function (itm) {
                        return listItm === itm.getName();
                    });
                teams.push(matches[0]);
            });

            return teams;
        },

        getEmptyRosterSpotCount: function () {
            var self = this,
                z = self.models.length,
                count = 0;
            for (z = 0; z < self.models.length; z = z + 1) {
                count = count + self.models[z].getEmptyCount();
            }
            return count;
        },

        setPlayerTeam: function (team) {
            var self = this,
                z = self.models.length;
            for (z = 0; z < self.models.length; z = z + 1) {
                if (self.models[z].attributes.name === team.attributes.name) {
                    self.playerTeam = self.models[z];
                }
            }
        },

        getPlayerTeam: function () {
            return this.playerTeam;
        }
	});

	app.teams = new Teams();
}());
