/*global Backbone */
var app = app || {};

(function () {
	'use strict';

    var Randomizer = function () {
        var self = this;
    
        self.getRnd = function (range, offset) {
            return Math.floor((Math.random() * range) + offset);
        };
    };
    
    app.randomizer = new Randomizer();
}());