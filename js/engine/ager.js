/*global Backbone */
var app = app || {};

(function () {
    'use strict';
    app.PlayerAger = function () {
        var self = this;
        
        self.agePlayers = function () {
            _.each(app.players.models, self.agePlayer);


            var collection = [];
            _.each(app.players.models, function(itm) {
                if(itm.player.isRetired()) {
                    collection.push(itm);
                }
            });

            app.players.remove(collection);
            app.PlayerBuilder();
        };

        self.agePlayer = function (model) {
            var retired = false,
                bum = false;
            model.player.age();         
        };
    };

    app.PlayerAger = new app.PlayerAger;
}());