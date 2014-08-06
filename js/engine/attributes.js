/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    app.PlayerAttributes = function () {
		var self = this,
			list = [],
			name,
			position,
			age;

		self.generate = function (power, postInit) {
			var atts = app.PlayerAttributeGenerator.generate(power, postInit);
			age = atts.age;
			name = atts.name;
			list = atts.list;
			position = atts.position;
			return self.getPower() / app.globalConfig.numberOfAttributes;
		};

		self.getPower = function () {
			return _.reduce(list, function(itm, num){ return itm + num; }, 0);
		};

		self.getAll = function () {
			return list;
		};

		self.getPosition = function () {
			return position;
		};
        
		self.getName = function () {
			return name;
		};

		self.getAge = function () {
			return age;
		};

		self.getExperience = function () {
			return age - 20;
		};

		self.age = function (freeAgent) {
			age = age + 1;
			list = app.PlayerAttributeGenerator.modifyAttributes({
				age: age,
				atts: list,
				fa: freeAgent
			});
		};
	};

	app.PlayerAttributeGenerator = function () {
		var self = this,
			rand = app.randomizer,
			playerValueChangeRegistory = {
                '-1': app.globalConfig.players.playerDropProb,
                '1': app.globalConfig.players.playerRiseProb
            };

		self.generate = function (power, postInit) {
			var getter, value, myNameGenerator, matrix, getAge,
				age,
				experience,
				name,
				position,
                i,
				list = [],
				ret,
                alreadyDefined = false;

			getAge = function (rand) {
	            return 20 + rand.getRnd(6, 0) + rand.getRnd(8, 0);
			};

			if (postInit) {
				matrix = {aceLow: app.globalConfig.players.postAce, aceHigh: app.globalConfig.players.postStar, age: function () {}};
				getAge = function (rand) {
	                return 20 + rand.getRnd(3, 0);
				};
			} else {
				matrix = {aceLow: app.globalConfig.players.initialAce, aceHigh: app.globalConfig.players.initialStar, age: function () {}};
			}

			if (list.length > 0) {
				list = [];
			}

			if (!alreadyDefined) {
				getter = app.PlayerAttributeGenerator.defineGetter(matrix);

				for (i = 0; i < app.globalConfig.numberOfAttributes; i = i + 1) {
					value = getter(matrix);
					list.push(value);
				}

				age = getAge(rand);
				experience = age - 20;
				myNameGenerator = new nameGenerator();
				name = myNameGenerator.getNextFirstName() + " " + myNameGenerator.getNextLastName();
				position = app.globalConfig.positions[Math.floor(Math.random() * app.globalConfig.positions.length)].name;
			}


			ret = {
				age: age,
				experience: experience,
				name: name,
				position: position,
				list: list
			};
			return ret;
		};

		self.modifyAttributes = function (data) {
			var rand = app.randomizer,
				impr,
				magnitude = 2,
				sign = 1,
				newVal = 0,
                i,
				age = data.age,
				atts = data.atts,
				constants = app.globalConfig.players;

			if (age < constants.playerRisingAge || age > (constants.playerDropOffAge + 2)) {
				magnitude = magnitude + 1;
			}
			if (age > constants.playerDropOffAge) {
				sign = -1;
			}
			
			for (i = 0; i < 5; i = i + 1) {
				impr = rand.getRnd(magnitude, 0) * sign;
				newVal = i === 2 ? atts[i] : impr + atts[i];

				if (newVal > 10) {
					newVal = 10;
				}
				if (newVal < 3) {
					newVal = atts[i];
				}

				if (self.isPlayerValueChange(playerValueChangeRegistory[sign])) {
					atts[i] = newVal;
				}
			}
			return atts;
		};

		self.isPlayerValueChange = function (konstant) {
			return rand.getRnd(100, 0) <= konstant;
		};

		self.defineGetter = function (pctMatrix) {
			var superAttribute = rand.getRnd(100, 1),
                getter,
                set = false,
				matrix = pctMatrix || {},
                aceLow = matrix.aceLow || 65,
				aceHigh = matrix.aceHigh || 92;

			if (superAttribute > aceLow && superAttribute < aceHigh) {
				getter = self.aceAttribute;
				set = true;
			}
			if (superAttribute > aceHigh) {
				getter = self.starAttribute;
				set = true;
			}
			if (!set) {
				getter = self.bumAttribute;
			}

			return getter;
		};

		self.bumAttribute = function () {
			var superAttribute = rand.getRnd(10, 1),
                value = 0;

			if (superAttribute > 7) {
				value = rand.getRnd(3, 3) + rand.getRnd(2, 3);
			} else if (superAttribute > 3) {
				value = rand.getRnd(5, 1) + rand.getRnd(2, 1);
			} else {
				value = rand.getRnd(4, 1) + rand.getRnd(2, 0);
			}
			return value;
		};

		self.aceAttribute = function () {
			var superAttribute = rand.getRnd(10, 1),
                value = 0;

			if (superAttribute > 8) {
				value = rand.getRnd(3, 8);
			} else if (superAttribute > 5) {
				value = rand.getRnd(3, 2) + rand.getRnd(2, 3);
			} else {
				value = rand.getRnd(3, 1) + rand.getRnd(3, 1);
			}

			return value;
		};

		self.starAttribute = function () {
			var superAttribute = rand.getRnd(10, 1),
                value = 0;

			if (superAttribute > 7) {
				value = rand.getRnd(2, 9);
			} else if (superAttribute > 3) {
				value = rand.getRnd(1, 4) + rand.getRnd(2, 3);
			} else {
				value = rand.getRnd(2, 3) + rand.getRnd(2, 2);
			}

			return value;
		};
	};

    app.PlayerAttributeGenerator = new app.PlayerAttributeGenerator();
}());
