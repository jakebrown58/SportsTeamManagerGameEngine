/*global Backbone */
var app = app || {};

(function () {
	'use strict';

    app.Player = function (skipAuto) {
        var self = this,
            myAttributes = new app.PlayerAttributes();
    
        self.generate = function (power, postInit) {
            return myAttributes.generate(power, postInit);
        };
    
        self.getPower = function () {
            return myAttributes.getPower();
        };
    
        self.getSubPower = function (key) {
            var p = myAttributes.getAll();
            if (key === "o") {
                p = p[0] + p[1];
            } else {
                p = p[3] + p[4];
            }
            return p;
        };
    
        self.getAttributes = function () {
            return myAttributes.getAll();
        };
    
        self.getName = function () {
            return myAttributes.getName();
        };

        self.getPosition = function () {
            return myAttributes.getPosition();
        };
    
        self.getAge = function () {
            return myAttributes.getAge();
        };
    
        self.getExperience = function () {
            return myAttributes.getExperience();
        };
    
        self.age = function () {
            var self = this;
            myAttributes.age();
        };
        
        self.isWashedUp = function () {
            var rand = app.randomizer,
                bored = myAttributes.getAge() >= (app.globalConfig.retirementAge - rand.getRnd(2, 0) + rand.getRnd(4, 0)),
                stinks = myAttributes.getPower() <= app.globalConfig.numberOfAttributes * app.globalConfig.numberOfAttributes;
            return bored || stinks;
        };
    
        self.isRetired = function () {
            var rand = app.randomizer,
                tooOld = myAttributes.getAge() >= app.globalConfig.retirementAge;
            return tooOld || this.isWashedUp();
        };

        if (!skipAuto) {
            self.generate();
        }
    };
}());