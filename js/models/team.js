/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Team Model
    // ----------
    app.Team = Backbone.Model.extend({
        defaults: {
            name: '',
            maxActiveCount: app.globalConfig.activePlayersPerTeam,
            currentRosterCount: 0
        },

        isFull: function() {
            var self = this;
            return self.attributes.currentRosterCount === app.globalConfig.playersPerTeam;
        },

        init: function () {
            var self = this;
            self.attributes.name = "NAME";
        },

        toJSON: function () {
            var self = this;

            return { name: self.attributes.name, power: self.getPower() };
        },

        getName: function () {
            var self = this;
            return self.attributes.name;
        },

        getEmptyCount: function () {
            this.attributes.currentRosterCount = this.getPlayers().length;
            return app.globalConfig.playersPerTeam - this.attributes.currentRosterCount;
        },

        rawPower: function () {
            var self = this,
                tPower = 0,
                i = 0,
                players = self.getPlayers();

            for (i = 0; i < players.length; i = i + 1) {
                tPower += players[i].getPower();
            }

            return tPower;

        },

        getRelativePower: function () {
            var self = this,
                teams = app.teams.getTeams(),
                powerbyTeam = [];
            _.each(teams, function(team){
                powerbyTeam.push({team: team.getName(), power: team.getPowerRaw()});
            });

            if(self.getPowerRaw() === "") {
                return "";
            }

            var ret = "";

            ret = ret + self.getDescription(function (x) { return (-1) * x.power.offense }, self.getName(), powerbyTeam, "offense");
            ret = ret + self.getDescription(function (x) { return (-1) * x.power.defense }, self.getName(), powerbyTeam, "defense");
            ret = ret + self.getDescription(function (x) { return x.power.intel }, self.getName(), powerbyTeam, "smarts");
            ret = ret + self.getDescription(function (x) { return (-1) * x.power.age }, self.getName(), powerbyTeam, "exp");

            if(ret.length > 0){
                ret = ret.substring(0, ret.length - 2);
            }

            if (ret === "") {
                ret = "nothing special";
            }

            return ret;
            // var sorted = _.sortBy(powerbyTeam, function (x) { return (-1) * x.power.offense });

            // var index = 0;
            // index = sorted.indexOf(
            //     _.filter(sorted, function (x) { return x.team === self.getName(); 
            //     })[0]
            // );

            // if (index === 0){
            //     return 'excellent offense';
            // } 
            // if( index === 1 ){
            //     return 'great offense';
            // }
            // if( index === app.globalConfig.teamCount - 2){
            //     return 'bad offense';
            // }
            // if( index === app.globalConfig.teamCount - 1){
            //     return 'terrible offense';
            // }

            // return 'ok offense';
        },

        getDescription: function (sortFn, teamName, teamPowers, descr) {
            var sorted = _.sortBy(teamPowers, sortFn),
                index = sorted.indexOf(_.filter(sorted, function (x) { return x.team === teamName; })[0]),
                ret = "";

            if (index === 0){
                ret = 'great ' + descr + ", ";
            } 
            if( index === 1 ){
                ret = 'good ' + descr + ", ";
            }
            if( index === app.globalConfig.teamCount - 2){
                ret = 'bad ' + descr + ", ";
            }
            if( index === app.globalConfig.teamCount - 1){
                ret = 'terrible ' + descr + ", ";
            }

            return ret;
        },

        getPowerRaw: function () {
            var self = this,
                oPower = 0,
                dPower = 0,
                tPower = 0,
                age = 0,
                i = 0,
                players = self.getActivePlayers(),
                divisor = players.length > 0 ? players.length : 1;

            if( players.length === 0 ) {
                return "";
            }

            for (i = 0; i < players.length; i = i + 1) {
                tPower += players[i].getPower();
                oPower += players[i].getSubPower('o');
                dPower += players[i].getSubPower('d');
                age += players[i].getAge();
            }

            tPower = tPower / (divisor * 5);
            tPower = Math.round(tPower * 100) / 100;

            oPower = oPower / (divisor * 2);
            oPower = Math.round(oPower * 100) / 100;

            dPower = dPower / (divisor * 2);
            dPower = Math.round(dPower * 100) / 100;

            age = Math.round( age * 10 / divisor ) / 10;
            return {total: tPower,
                offense: oPower,
                defense: dPower,
                intel: oPower + dPower - tPower,
                age: age};
        },

        getPower: function () {
            var self = this,
                obj = self.getPowerRaw(),
                str = obj === "" ? "" : "T: " + obj.total + " O: " + obj.offense + " D: " + obj.defense  + " A: " + obj.age;

            
            return self.getRelativePower();
        },

        getPlayers: function () {
            var self = this;
            return _.filter(app.players.getAll(), function(item) { 
                return item.attributes.teamName === self.getName(); 
            });
        },

        getActivePlayers: function (type) {
            var rank = [],
                ret = [],
                powerArg = type === 'offense' ? 'o' : 'd';
            _.each(this.getPlayers(), function(itm) {rank.push(itm);});

            rank = _.sortBy(rank, function(o) {return o.getSubPower(powerArg);});
            rank.reverse();

            _.each(rank, function(itm) { 
                if (ret.length < app.globalConfig.activePlayersPerTeam) {
                    ret.push(itm);
                }
            });

            return ret;
        },


        swapPlayers: function (draftCandidate) {
            var self = this,
                roster = this.getPlayers(),
                ranks = app.draftManager.rankPlayers(roster, draftCandidate).reverse();

            if(ranks[0] !== draftCandidate) {
                self.releasePlayer(ranks[0]);
                self.signPlayer(draftCandidate);
            }

        },        

        releasePlayer: function (player) {
            var self = this,
                len = self.getPlayers().length;

            if (len > 0 ) {
                player.attributes.teamName = null;
                self.set('currentRosterCount', len - 1);
                return true;
            }

            return false;
        },

        canSignPlayer: function (player) {
            var self = this,
                players = self.getPlayers(),
                countMatch = 0,
                ok = false;

            _.each(players, function(p) {
                countMatch += p.getPosition() === player.getPosition() ? 1 : 0;
            });

            _.each(app.globalConfig.positions, function(p) {
                if(player.getPosition() === p.name) {
                    ok = countMatch < p.rosterLimit;
                }
            });

            return ok;
        },

        signPlayer: function (player) {
            var self = this,
                len = self.getPlayers().length;

            if (!self.isFull()) {              
                player.attributes.teamName = self.attributes.name;
                self.set('currentRosterCount', len + 1);
                return true;
            }

            return false;
        }
    });
}());
