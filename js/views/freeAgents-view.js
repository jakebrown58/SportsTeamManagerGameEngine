
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
    'use strict';

    // team Item View
    app.EverybodyView = Backbone.View.extend({
        //... is a list tag.
        tagName:  'table',

        // Init by rendering.
        initialize: function () {
            var self = this;        
            _.bindAll(this, 'render', 'renderOne');
        },

        tryGetTemplate: function () {
            var self = this;
            if (self.template === undefined) {
                try {
                    self.template = _.template($('#item-template').html());
                } catch (e) {
                    self.template = function (json) {
                        return json;
                    };
                }
            }
        },

        attributes: function () {
            return {
                'class': "table"
            };
        },

        render : function () {
            var self = this,
                sortedList;
            self.tryGetTemplate();

            this.$el.html(this.template({ name: "Everybody"}));

            sortedList = _.sortBy(app.players.models, function (element) { return (-1 * element.player.getPower()); });
            _(sortedList).each(self.renderOne);
            return this;
        },

        renderOne: function (model) {
            var row = new app.PlayerView({model : model});
            this.$el.append(row.render().$el);
            return this;
        },

        clear: function () {
            this.model.destroy();
        }
    });

    // team Item View
    app.FreeAgentView = Backbone.View.extend({
        //... is a list tag.
        tagName:  'table',

        // Init by rendering.
        initialize: function () {
            var self = this;
            self.listenTo(self.model, 'change', self.render);
        
            _.bindAll(this, 'render', 'renderOne');
        },

        tryGetTemplate: function () {
            var self = this;
            if (self.template === undefined) {
                try {
                    self.template = _.template($('#item-template').html());
                } catch (e) {
                    self.template = function (json) {
                        return json;
                    };
                }
            }
        },

        attributes: function () {

            return {
                'class': "table"
            };
        },

        render : function () {
            var self = this,
                filtered = self.filter(),
                sortedList,
                show = !app.teams.areAllTeamsFull();

            if(!show){
                this.$el.html("");
                return this;
            }
            self.tryGetTemplate();

            this.$el.html(this.template({ name: "Free Agents"}));

            sortedList = _.sortBy(filtered,
                function (element) { 
                    return (-1 * element.player.getPower()); 
                });
            _(sortedList).each(self.renderOne);
            return this;
        },

        subViews: [],

        close: function () {
            this.$el.html("");
            this.unbind();
            this.remove();
            _.each(this.subViews, function(itm) {
                itm.close();
            });
            this.subViews = [];
        },      

        filter: function(){
            var self = this,
                filtered = [];

            filtered = _.filter(app.players.models, 
                function(element) { 
                    return (element.attributes.teamName === "Free Agent" || element.attributes.teamName == null); 
                });
            return filtered;
        },

        renderOne: function(model) {
            var row = new app.PlayerView({model:model});
            this.subViews.push(row);            
            this.$el.append(row.render().$el);
            return this;
        }
    });

})(jQuery);
