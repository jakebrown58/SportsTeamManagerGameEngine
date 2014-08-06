//global Backbone, jQuery, _, ENTER_KEY 
var app = app || {};

(function ($) {
    'use strict';

    var vent = _.extend({}, Backbone.Events);

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    app.DgAppView = Backbone.View.extend({

        el: '#draftgame',

        events: {
            'click .draft': 'showDraft',
            'click .standings': 'showStandings'
        },

        state: 'draft',
        subViews: [],        

        initialize: function () {
            var self = this;
            this.$main = this.$('#main');

            if (app.teams.models.length === 0) {
                self.buildTeams();
            }

            this.vent = vent;
            self.state = 'draft';
            this.vent.on('show-team', self.showTeamSummary, self);

            app.teams.models = _.sortBy(app.teams.models, function (team) { 
                return (-1 * team.rawPower()); 
            }); 

            this.addAll();
        },

        showDraft: function () {
            if (this.state === 'standings') {
                this.close();
                this.$('#team-list').html('');
                this.$('#secondary-list').html('');
                this.addAll();
                this.state = 'draft';
            }
        },

        showStandings: function () {
            if (this.state === 'draft' && app.teams.areAllTeamsFull()) {
                this.close();
                this.addStandings();
                this.state = 'standings';
            }
        },        
        
        buildTeams: function () {
            app.TeamBuilder();  
        },

        render: function () {
            this.$main.show();
        },

        addOne: function (team) {
            var view = new app.TeamView({ model: team });
            this.subViews.push(view);
            $('#team-list').append(view.render().el);
        },

        // Add all items at once.
        addAll: function () {
            this.$('#teams-list').html('');
            app.teams.each(this.addOne, this);

            var freeAgentView = new app.FreeAgentView({model: app.teams.getFreeAgents()});
            this.subViews.push(freeAgentView);
            $('#team-list').append(freeAgentView.render().el);            
        },

        currentSeason: '',

        // Add all items at once.
        addStandings: function () {
            this.$('#team-list').html('');
            app.teams.fillTeams();                
            var season = app.SeasonManager(),
                view = new app.StandingsView(app.teams, season, vent), 
                render;
            this.subViews.push(view);                
            app.PlayerAger.agePlayers();
            render = view.render();
            $('#team-list').append(render.el);
        },

        close: function () {
            _.each(this.subViews, function(itm) {
                itm.close();
            });
            this.subViews = [];
        },    

        showTeamSummary: function () {
            var self = this,
                action = app.teams.showAction,
                selectedTeamName = action.team,
                teamGames = app.seasonHistory.getTeamGames(action.result, selectedTeamName),
                ntsObjects = [],
                ntsHeader;

            _.each(teamGames, function (itm) { ntsObjects.push(app.seasonHistory.getSingleGameBoxScore(itm, selectedTeamName)); });

            ntsHeader = {
                name: "",
                tags: ["Winner", "Loser", "Score", "Margin"],
                specials: []
            };

            this.$('#secondary-list').html('');
            var view = new app.ExpandableHeader();
            self.$('#secondary-list').append(view.render(ntsHeader).el);
            _.each(ntsObjects, function (itm) {
                var view = new app.ExpandableRow({ model: itm});
                self.$('#secondary-list').append(view.render().$el);
            });
            return this;
        }
    });
})(jQuery);
