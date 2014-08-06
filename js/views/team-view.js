/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    // team Item View
    app.TeamView = Backbone.View.extend({
        //... is a list tag.
        tagName:  'table',

        // Init by rendering.
        initialize: function () {
            var self = this,
                players = self.model.getPlayers();

            self.listenTo(self.model, 'change:completed', self.render);
            self.listenTo(self.model, 'change:currentRosterCount', self.render);
            self.listenTo(self.model, 'change', self.renderNameChange);
            _.bindAll(this, 'render', 'renderOne');
        },

        tryGetTemplate: function () {
            var self = this;
            if (self.template === undefined) {
                try {
                    self.template = _.template($('#team-template').html());
                } catch (e) {
                    self.template = function (json) {
                        return json;
                    };
                }
            }
        },

        renderNameChange : function () {
            this.render();
        },

        attributes: function () {
            return {
                'class': "table"
            };
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

        render : function () {
            var self = this,
                sortedList;
            self.tryGetTemplate();

            this.$el.html(this.template(this.model.toJSON()));
            sortedList = _.sortBy(self.model.getPlayers(), function (element) { return (-1 * element.player.getPower()); });

            //if(self.model.getName() === app.teams.getPlayerTeam().getName()){
                _(sortedList).each(self.renderOne);
            //}

            return this;
        },

        renderOne: function (model) {
            var row = new app.PlayerView({model : model});
            this.subViews.push(row);
            this.$el.append(row.render().$el);
            return this;
        }
    });
})(jQuery);
