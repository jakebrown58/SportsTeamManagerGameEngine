/*global Backbone */
var app = app || {};

(function () {
	'use strict';


    var DraftManager = (function () {
        var mode = 'init',
            self = this,
            draftState = {};

        self.startDraft = function (freeAgents, teams, playerTeam, draftStyle) {
            var self = this;
            self.draftRoundFn = self.getDraftMode();
            self.freeAgents = freeAgents;
            self.playerTeam = playerTeam;
            self.teams = teams;

            if (draftStyle) {
                self.draftStyle = draftStyle;
            }
        
            self.draftState = {};
            self.draftState.round = 1;
            self.draftState.draftOrder = [];
            self.draftState.currentPick = 1;
            self.draftState.picks = [];
        };

        self.getDraftMode = function () {
            var firstYear = app.seasonHistory ? app.seasonHistory.getYear() === 0 : 0;

            if (firstYear) {
                self.draftStyle = 'snake';
            } else {
                self.draftStyle = 'round';
            }

            return firstYear ? self.snakeDraftRound : self.worstFirstRound;
        };

        self.handleSign = function () {
            var self = this;

            self.draftRoundFn();
            
            self.draftState.currentPick = 1;
            self.draftState.round = self.draftState.round + 1;
            self.freeAgents.set('changed', self.freeAgents.attributes.changed * -1);
        };

        self.pruneTeams = function () {
            var mendozaLine = 0,
                freeAgents = self.freeAgents.getPlayers(),
                releaseAbles = [],
                teams = app.teams.getTeams(),
                playersInOrder;

            playersInOrder = _.sortBy(freeAgents, function (x) { return x.getPower(); });

            if (playersInOrder.length > 5) {
                mendozaLine = playersInOrder[4];

                _.each(teams, function (team) {
                    _.each(team.getPlayers(), function (player) {
                        var rating = player.getPower();
                        if (rating < mendozaLine.getPower()) {
                            releaseAbles.push(player);
                        }
                    });
                });

                _.each(releaseAbles, function (itm) {
                    app.teams.releasePlayer(itm);
                });
            }
        };

        self.getNextChooser = function () {
            var currentTeam,
                z = 0;
            if( self.draftStyle === 'snake' ){
                if (self.draftState.round % 2 === 1) {
                    currentTeam = self.teams[self.draftState.currentPick - 1];
                } else {
                    currentTeam = self.teams[self.teams.length - self.draftState.currentPick];
                }
            } else {
                currentTeam = self.teams[self.draftState.currentPick - 1];
            }

            return currentTeam;
        };

        self.logPick = function (team, player) {
            self.draftState.picks.push({team: team, player: player});

            if( self.teams.length === self.draftState.currentPick) {
                self.draftState.round = self.draftState.round + 1;
                self.draftState.currentPick = 1;
            } else {
                self.draftState.currentPick = self.draftState.currentPick + 1;
            }
        };

        self.autoRun = function () {
            var nextChooser = self.getNextChooser(),
                nextPick,
                ct = 0;
            while( nextChooser !== self.playerTeam) {
                nextPick = self.aiFindPlayer(nextChooser);

                if(nextPick) {
                    if(nextChooser.isFull) {
                        if (nextChooser.isFull() && nextChooser.swapPlayers) {
                            nextChooser.swapPlayers(nextPick, self.getPlayerEvaluator);
                        } else {
                            nextChooser.signPlayer(nextPick);
                        }
                    } else if (nextChooser.signPlayer) {
                        nextChooser.signPlayer(nextPick);
                    }
                }

                self.logPick(nextChooser, nextPick);
                nextChooser = self.getNextChooser();

                ct = ct + 1;
                if(ct === 500) {
                    return "error!";
                }
            }
        };

        self.fillTeams = function () {
            var self = this;

            if (self.mode === 'snake') {
                self.snakeDraftRound();
            }
            
            self.draftState.currentPick = 1;
            self.draftState.round = self.draftState.round + 1;
            self.freeAgents.set('changed', self.freeAgents.attributes.changed * -1);
        };

        self.refresh = function () {
            self.freeAgents.set('changed', self.freeAgents.attributes.changed * -1);
        };

        self.snakeDraftRound = function () {
            var self = this,
                z = self.teams.length,
                playerTeam = self.playerTeam,
                playerToSign,
                freeAgents,
                currentTeam;

            if (self.draftState.round % 2 === 1) {
                for (z = 0; z < self.teams.length; z = z + 1) {
                    currentTeam = self.teams[z];
                    if (currentTeam.attributes.name !== playerTeam.attributes.name) {
                        self.draftState.currentPick = self.draftState.currentPick + 1;
                        currentTeam.signPlayer(self.aiFindPlayer());
                    }
                }
                for (z = self.teams.length - 1; z >= 0; z = z - 1) {
                    currentTeam = self.teams[z];
                    if (currentTeam.attributes.name !== playerTeam.attributes.name) {
                        self.draftState.currentPick = self.draftState.currentPick + 1;
                        currentTeam.signPlayer(self.aiFindPlayer());
                    }
                }
            }
        };

        self.aiFindPlayer = function (team) {
            var self = this,
                freeAgents = self.freeAgents.getPlayers(),
                playerToSign,
                fn = self.getPlayerEvaluator,
                filteredFreeAgents = [];

            _.each(freeAgents, function (x) {
                if(team.canSignPlayer(x)) {
                    filteredFreeAgents.push(x);
                }
            });

            _.each(filteredFreeAgents, function (x) { playerToSign = fn(x, playerToSign); });

            return playerToSign;
        };

        self.getPlayerEvaluator = function (x, y) {
            if (!y) {
                return x;
            }

            var powerDiff = x.getPower() - y.getPower(),
                ageDiff = x.getAge() - y.getAge(),
                totalDiff = powerDiff - (ageDiff / 10);
            return totalDiff > 0 ? x : y;
        };

        self.rankPlayers = function(players, bestAvailable) {
            var rank = [];
            rank.push(bestAvailable);
            
            _.each(players, function(itm) {rank.push(itm);});

            rank = _.sortBy(rank, function(o) {return o.getPower();});
            rank.reverse();

            return rank;

        };
    });
    
    app.draftManager = new DraftManager();
}());
