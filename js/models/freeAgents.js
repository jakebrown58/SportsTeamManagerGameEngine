/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Team Model
    // ----------
    app.FreeAgentPool = Backbone.Model.extend({
        defaults: {
            freeAgentCount: 0,
            changed: 1
        },
        
        init: function () {
            var self = this;
        },

        getPlayers: function () {
            return this.filter();
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

        toJSON: function () {
            var self = this;

            return { name: "Free Agemts", power: self.freeAgentCount };
        },

        signPlayer: function (player) {
            var self = this,
                len = self.getPlayers().length;

            self.set('freeAgentCount', len < 0 ? 0 : len - 1);
            return true;
        }
    });
}());
