/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    app.StandingsView = Backbone.View.extend({
        tagName:  'table',
        seasonResult: '',
        ix: 0,
        vent: '',

        events: {
            'click .team': 'showTeamDetails',
        },

        subViews: [],

        close: function () {
            this.unbind();
            this.remove();
            _.each(this.subViews, function(itm) {
                itm.close();
            });
            this.subViews = [];
        },        

        // Init by rendering.
        initialize: function (teams, season, vent) {
            var self = this;
            self.vent = vent;
            
            self.seasonResult = season;
            _.bindAll(this, 'render', 'renderOne');
        },

        renderOne: function (team) {
            var self = this,
                view = new app.TeamRecordView({ model: team, outcome: self.seasonResult.outcomes[self.ix], gp: self.seasonResult.gamesPerTeam });
            this.subViews.push(view);
            this.$el.append(view.render().$el);
            self.ix = self.ix + 1;
        },

        render: function () {
            this.$('#teams-list').html('');
            var view = new app.TeamRecordHeader();
            this.subViews.push(view);
            this.$el.append(view.render().el);
            app.teams.each(this.renderOne, this);
            this.$('#teams-list').append(this.$el);
            return this;
        },

        showTeamDetails: function (evt) {
            app.teams.handleShowSeason({team: evt.target.innerText, result: this.seasonResult});
            this.vent.trigger('show-team');
        }
    });


    app.TeamRecordView = Backbone.View.extend({
        tagName: "tr",

        events: {
        },

        // Init by rendering.
        initialize: function (team) {
            var self = this;
            self.model = team;
            self.specials = [];
        },

        render: function () {
            var self = this,
                html = self.buildHtml();
            this.$el.html(html);
            return this;
        },

        close: function () {
            this.unbind();
            this.remove();
        },        

        buildHtml: function () {
            var self = this,
                html,
                obj,
                allTime;

            allTime = app.seasonHistory.getAllTimeWL(self.model.model.attributes.name);

            obj = { name: self.model.model.attributes.name,
                tags: [self.model.outcome.wins,
                    self.model.outcome.losses,
                    Math.round(self.model.outcome.ptsFor / self.model.gp),
                    Math.round(self.model.outcome.ptsAgainst / self.model.gp),
                    allTime.w + " - " + allTime.l,
                    app.seasonHistory.getChampionships(self.model.model.attributes.name)],
                specials: self.specials };
            self.template = $('#standings-template').html();
            html = _.template(self.template, obj);
            return html;
        }
    });

    app.TeamRecordHeader = Backbone.View.extend({
        tagName: "tr",

        // Init by rendering.
        initialize: function () {
        },

        render: function() {
            var self = this,
                html = self.buildHtml();
            this.$el.html(html);
            return this;
        },

        close: function () {
            this.unbind();
            this.remove();
        },        

        buildHtml: function(){
            var self = this,
                html, 
                obj;

            obj = { name: 'Team', 
                tags: ['Wins','Losses','PF','PA','All time','Rings'], 
                specials: []};
            self.template = $('#standings-header-template').html();
            html = _.template(self.template, obj);
            return html;
        }
    });

    app.ExpandableRow = Backbone.View.extend({
        tagName: "tr",

        events: {
        },

        // Init by rendering.
        initialize: function (ntsObject) {
            var self = this;
            self.model = ntsObject;
        },

        render: function() {
            var self = this,
                html = self.buildHtml();
            this.$el.html(html);
            return this;
        },

        buildHtml: function(){
            var self = this,
                html;
            self.template = $('#standings-template').html();
            html = _.template(self.template, self.model.model);
            return html;
        }
    });

    app.ExpandableHeader = Backbone.View.extend({
        tagName: "tr",

        // Init by rendering.
        initialize: function () {
        },

        render: function(ntsHeader) {
            var self = this,
                html = self.buildHtml(ntsHeader);
            this.$el.html(html);
            return this;
        },

        buildHtml: function(ntsHeader){
            var self = this,
                html;
            self.template = $('#standings-header-template').html();
            html = _.template(self.template, ntsHeader);
            return html;
        }
    });    
})(jQuery);
