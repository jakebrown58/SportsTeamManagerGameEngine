/*global Backbone */
var app = app || {},
    _ = _ || {};

(function () {
    'use strict';

    app.SeasonManager = function () {
        var self = this,
            startDate = new Date().getFullYear(),
            currentSeason;

        
        self.playSeason = function () {
            var self = this;
            self.mySeason = new season(app.teams.models, { seasonLength: app.globalConfig.seasonLength});
        };
        
        self.getSeason = function () {
            return self.mySeason;
        };

        self.getTeamOrder = function () {
            return currentSeason.getTeamOrder();
        };

        self.playSeason();
        currentSeason = self.getSeason().getSeasonResult();
        app.seasonHistory.addSeason(currentSeason);
        app.seasonHistory.awardChampionship();
        return currentSeason;
    };

    var SeasonHistory = function () {
        var self = this,
            seasons = [],
            champions = [],
            startDate = new Date().getFullYear();

        self.reset = function () {
            seasons = [];
            champions = [];
        };

        self.getYear = function () {
            return seasons.length;
        };

        self.getSeasons = function () {
            return seasons;
        };

        self.addSeason = function (gameHistory) {
            seasons.push(gameHistory);
        };

        self.awardChampionship = function () {
            var x = _.sortBy(seasons[seasons.length-1].outcomes, function (o) { return o.wins; });
            x.reverse();
            champions.push(x[0].team);
            x[0].champion = true;
        };

        self.getChampionships = function (teamName) {
            return _.filter(champions, function (x) { return x === teamName; }).length;
        };

        self.getAllTimeWL = function (teamName) {
            var self = this,
                selectedTeamName = teamName,
                selectedTeam,
                selectedTeamId,
                ret = {w: 0, l: 0};

            _.each(seasons, function (x) {
                _.each(x.outcomes, function(g) {
                    if(g.team === teamName) {
                        ret.w = ret.w + g.wins;
                        ret.l = ret.l + g.losses;
                    }
                });
            });

            return ret;
        };

        self.getTeamGames = function (gameHistory, teamName) {
            var selectedTeamName = teamName,
                selectedTeam,
                selectedTeamId,
                ret = [];

            selectedTeam = _.filter(app.teams.getTeams(), function (itm) {
                return itm.getName() === selectedTeamName;
            });

            selectedTeamId = app.teams.indexOf(selectedTeam[0]);

            ret = _.filter(gameHistory.detailedResults, function (itm) {
                return itm.winner === selectedTeamId || itm.loser === selectedTeamId;
            });

            return ret;
        };

        self.getSingleGameBoxScore = function (itm, teamName) {
            var obj = {
                name: "",
                tags: [app.teams.models[itm.winner].getName(), 
                    app.teams.models[itm.loser].getName(), 
                    itm.wS + " - " + itm.lS, 
                    itm.wS - itm.lS],
                specials: []
            };

            if(obj.tags[0] === teamName ){
                obj.tags[0] = 'w';
            }
            if(obj.tags[1] === teamName ){
                obj.tags[1] = 'l';
                obj.tags[3] = obj.tags[3] * -1;
            }

            return obj;
        };

        self.getFinishOrder = function (index) {
            var history,
                teams = [],
                nonChamps = [];

            if (seasons.length === 0){
                return undefined;
            }

            history = seasons[seasons.length - 1];

            if (index) {
                history = seasons[index];
            }

            _.each(history.outcomes, function (itm) {
                if (itm.champion) {
                    teams.push(itm.team);
                }
            });

            nonChamps = _.filter(history.outcomes, function(itm){
                return !itm.champion;
            })

            nonChamps = _.sortBy(nonChamps, function (o) { return o.wins; });
            nonChamps.reverse();

            _.each(nonChamps, function (itm) {
                teams.push(itm.team);
            });

            return teams;
        }
    };

    app.seasonHistory = new SeasonHistory();
}());
