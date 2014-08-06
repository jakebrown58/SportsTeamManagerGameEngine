var _ = _ || {};

var season = function (teams, config) {
    'use strict';
	var self = this,
		rand = self,
		totalGames = config ? config.seasonLength || 16 : 16;

    self.getRnd = function (range, offset) {
        return Math.floor((Math.random() * range) + offset);
    };

	self.getSeasonResult = function () {
		var gameCount = 0,
			seasonLength = totalGames,
			gameHistory = {},
            i,
            failSafe = teams.length,
            pairings;

		gameHistory.outcomes = [];
		gameHistory.detailedResults = [];
		gameHistory.totalGamesPlayed = 0;
		gameHistory.gamesPerTeam = totalGames;

		for (i = 0; i < teams.length; i = i + 1) {
			gameHistory.outcomes.push({team: teams[i].getName(), wins: 0, losses: 0, ptsFor: 0, ptsAgainst: 0});
		}

		for (gameCount = 0; gameCount < seasonLength; gameCount = gameCount + 1) {
			pairings = self.getAllPairings(teams);

			for (i = 0; i < pairings.length; i = i + 1) {
				gameHistory = self.getGameResult(gameHistory, pairings[i].h, pairings[i].a);
			}
		}
		return gameHistory;
	};

	self.getAllPairings = function (teams) {
		var self = this,
			pairings = {},
			h,
			a,
            i;

		pairings.teams = [];
		pairings.matches = [];

		_.each(teams, function (team) {
			pairings.teams.push({team: team, isAvailable: true});
		});

		for (i = 0; i < (teams.length / 2); i = i + 1) {
			pairings.teams = self.getNextTeam(pairings);
			h = pairings.teams.x;
			pairings.teams = self.getNextTeam(pairings);
			a = pairings.teams.x;
			pairings.matches.push({h: h, a: a});
		}

		return pairings.matches;
	};

	self.getNextTeam = function (config) {
		var teams = config.teams,
			goodToGo = false,
			x;
		while (!goodToGo) {
			x = rand.getRnd(teams.length, 0);
			if (teams[x].isAvailable) {
				teams[x].isAvailable = false;
				teams.x = x;
				goodToGo = true;
			}
		}

		return teams;
	};
    
    self.getGameResult = function (gameHistory, homeIx, awayIx) {
        var home = teams[homeIx],
            away = teams[awayIx],
            g = new game(home, away),
            winner = g.getWinner(),
            score = g.getRawScore(),
            didHomeWin = gameHistory.outcomes[homeIx].team === winner.getName(),
            winnerIx = didHomeWin ? homeIx : awayIx,
            loserIx = didHomeWin ? awayIx : homeIx,
            loser = teams[loserIx],
            winnerScore = didHomeWin ? score.homeScore : score.awayScore,
            loserScore = didHomeWin ? score.awayScore : score.homeScore;

        gameHistory.outcomes[winnerIx].wins = gameHistory.outcomes[winnerIx].wins + 1;
        gameHistory.outcomes[loserIx].losses = gameHistory.outcomes[loserIx].losses + 1;

        gameHistory.outcomes[winnerIx].ptsFor = gameHistory.outcomes[winnerIx].ptsFor + winnerScore;
        gameHistory.outcomes[winnerIx].ptsAgainst = gameHistory.outcomes[winnerIx].ptsAgainst + loserScore;
        gameHistory.outcomes[loserIx].ptsFor = gameHistory.outcomes[loserIx].ptsFor + loserScore;
        gameHistory.outcomes[loserIx].ptsAgainst = gameHistory.outcomes[loserIx].ptsAgainst + winnerScore;
        gameHistory.detailedResults.push({winner: winnerIx, loser: loserIx, wS: winnerScore, lS: loserScore});

		gameHistory.totalGamesPlayed = gameHistory.totalGamesPlayed + 1;
        return gameHistory;
    };
};

var game = function (homeTeam, awayTeam) {
	return new gameResult(homeTeam, awayTeam);
};

var gameResult = function( homeTeam, awayTeam){
	var self = this;
	var gp = new gamePlayer( homeTeam, awayTeam);
	
	self.score = function(){
		if( gp.getWinner() === undefined){
			gp.playBall();
		}
		return gp.getScore();
	}

	self.getRawScore = function(){
		return gp.getRawScore();
	}

	self.getWinner = function(){
		if( gp.getWinner() === undefined){
			gp.playBall();
		}
		return gp.getWinner();	
	}
};

var gamePlayer = function( theHomeTeam, theAwayTeam ){
	var self = this;
	var rand = app.randomizer;
	var homeTeam = theHomeTeam;
	var awayTeam = theAwayTeam;

	var homeScore = 0;
	var awayScore = 0;
	var winner;

	self.getScore = function(){
		return homeTeam.getName() + " " + homeScore + " - " + awayTeam.getName() + " " + awayScore;
	}

	self.getRawScore = function(){
		return {homeScore: homeScore, awayScore: awayScore};
	}

	self.getWinner = function(){
		return winner;
	}

	self.playBall = function(){
		var clock = 20;
		var homePossession = true;
		var driveBonus = 0;
		var tmpScore;

		if(homeTeam === 0){
			driveBonus = 0;
		}

		for( var i = 0; i < clock; i++){
			if( homePossession){
				driveBonus = driveBonus + 1;
				tmpScore = self.getPossessionScore( homeTeam, awayTeam, driveBonus );
			}
			else {
				tmpScore = self.getPossessionScore( awayTeam, homeTeam, driveBonus );	
			}

			if( tmpScore > 0 ){
				if( homePossession ){
					homeScore += tmpScore;
				}
				else{
					awayScore += tmpScore;
				}
				driveBonus = 0;
				i++;
				homePossession = !homePossession;
			}
			else{
				homePossession = !homePossession;
				driveBonus = tmpScore == 0 ? 2 : 0;
			}
		}

		if( homeScore >= awayScore){
			winner = homeTeam;
		}
		else {
			winner = awayTeam;
		}

		return winner;
	}

	self.getPossessionScore = function( o, d, driveBonus){
		var offense = {r: 0, p: 0, i: 0},
            defense = {r: 0, p: 0, i: 0},
            results = {},
            score;

        offense.roster = o.getActivePlayers('offense');
        defense.roster = d.getActivePlayers('defense');

        offense = self.fillOutTeamGameObject(offense, {r: 0, p: 1, i: 2});
        defense = self.fillOutTeamGameObject(defense, {r: 3, p: 4, i: 2});

        var oBonus = 8;
        var dBonus = 3;
        if( offense.i < defense.i ){
        	oBonus = 3;
        	dBonus = 8;
        }

        results.oRTotal = offense.r + rand.getRnd( oBonus, 0);
    	results.oPTotal = offense.p + rand.getRnd( oBonus, 0);
    	results.dRTotal = defense.r + rand.getRnd( dBonus, 0);
    	results.dPTotal = defense.p + rand.getRnd( dBonus, 0);

    	results.driveBonus = driveBonus;

		score = self.calculateDriveResult(results);
        return score;
    }

    self.calculateDriveResult = function(obj) {
    	var score = {},
    		rDiff = ( obj.oRTotal + obj.driveBonus - obj.dRTotal ),
        	pDiff = ( obj.oPTotal + obj.driveBonus - obj.dPTotal ),
        	bigRunSuccess =  rDiff > 5,
        	bigPassSuccess = pDiff > 5,
        	smallRunSuccess =  rDiff > 0,
        	smallPassSuccess = pDiff > 0;

		score = self.getScore({bigRunSuccess: bigRunSuccess, 
			bigPassSuccess: bigPassSuccess, 
			smallRunSuccess: smallRunSuccess, 
			smallPassSuccess: smallPassSuccess,
			rDiff: rDiff,
			pDiff: pDiff
		})

        return score;
    }

    self.setPositions = function(players, config) {
    	var tmp = players;

    	tmp = self.setPosition(tmp, function(x) {
    		return -1 * (x.getAttributes()[config.p] + x.getAttributes()[config.i]);
    	}, 'o','qb');

    	tmp = self.setPosition(tmp, function(x) {
    		return -1 * (x.getAttributes()[config.r] + x.getAttributes()[config.t]);
    	}, 'o','rb');

		_.times(2, function(x) {
			tmp = self.setPosition(tmp, function(x) {
    			return -1 * (x.getAttributes()[config.r]);
    		}, 'o', 'wr')
		});

    	_.each(tmp, function(x) {
    		x.oPos = 'ol';
    		x.atts = x.getAttributes();
    	});

    	tmp = players;

    	tmp = self.setPosition(tmp, function(x) {
    		return -1 * (x.getAttributes()[config.r] + x.getAttributes()[config.t] + x.getAttributes()[config.c]);
    	}, 'd', 'ss');

    	tmp = self.setPosition(tmp, function(x) {
    		return -1 * (x.getAttributes()[config.r] + 2 * x.getAttributes()[config.c]);
    	}, 'd','db');

		_.times(2, function(x) {
			tmp = self.setPosition(tmp, function(x) {
    			return -1 * (x.getAttributes()[config.r] + 2 * x.getAttributes()[config.t]);
    		}, 'd','lb')
		});

		_.times(1, function(x) {
			tmp = self.setPosition(tmp, function(x) {
    			return -1 * (x.getAttributes()[config.t]);
    		}, 'd','nt')
		});

    	_.each(tmp, function(x) {
    		x.dPos = 'dl';
    		x.atts = x.getAttributes();
    	});

    	return players;
    }

    self.setPosition = function(tmp, sortFn, type, pos) {
    	var curr = _.sortBy(tmp, sortFn),
    		itm;

    	itm = _.find(tmp, function(x) {
    		return x.getName() === curr[0].getName();
    	});

    	if(type === 'o') {
    		itm.oPos = pos;
    	} else {
    		itm.dPos = pos;
    	}

    	tmp = _.filter(tmp, function(x) {
    		return x.getName() != itm.getName();
    	});

    	return tmp;
    }

    self.getPlayerByPosition = function(players, position) {
    	var player = [];

    	_.each(players, function(x) {
    		if(x.oPos === position || x.dPos === position) {
    			player.push(x);
    		}
    	});

    	return player;
    }

    self.getOffenseRPI = function(obj, config) {
        var atts,
        	tmp = {};

        self.setPositions(obj.roster, config);

        obj.p = 0;
        obj.pb = 0;
        obj.rb = 0;
        obj.r = 0;
        obj.i = 0;

        tmp.qb = self.getPlayerByPosition(obj.roster, 'qb');
        tmp.rb = self.getPlayerByPosition(obj.roster, 'rb');
        tmp.wr = self.getPlayerByPosition(obj.roster, 'wr');
        tmp.ol = self.getPlayerByPosition(obj.roster, 'ol');

        _.each(tmp.qb, function(player) {
        	obj.p += player.getAttributes()[config.p] + player.getAttributes()[config.i] + self.expBonus(player);
        });
        _.each(tmp.wr, function(player) {
        	obj.p += player.getAttributes()[config.r] + self.expBonus(player);
        	obj.rb += player.getAttributes()[config.t] + self.expBonus(player);
        });
		_.each(tmp.ol, function(player) {
        	obj.pb += player.getAttributes()[config.t] + self.expBonus(player);
        	obj.rb += player.getAttributes()[config.t] + self.expBonus(player);
        });
		_.each(tmp.rb, function(player) {
        	obj.pb += player.getAttributes()[config.t] + self.expBonus(player);
        	obj.r += player.getAttributes()[config.r] + player.getAttributes()[config.t] + self.expBonus(player);
        });

	    _.each(obj.roster, function(player) {
            atts = player.getAttributes();
            obj.i += atts[config.i] + self.expBonus(player);
        });

        obj.tmp = tmp;

        return obj;
    }

    self.getDefenseRPI = function(obj, config) {
        var atts,
        	tmp = {};

        self.setPositions(obj.roster, config);

        obj.p = 0;
        obj.pb = 0;
        obj.rb = 0;
        obj.r = 0;
        obj.i = 0;

        tmp.ss = self.getPlayerByPosition(obj.roster, 'ss');
        tmp.db = self.getPlayerByPosition(obj.roster, 'db');
        tmp.lb = self.getPlayerByPosition(obj.roster, 'lb');
        tmp.nt = self.getPlayerByPosition(obj.roster, 'nt');
        tmp.dl = self.getPlayerByPosition(obj.roster, 'dl');

        _.each(tmp.ss, function(player) {
        	obj.pb += player.getAttributes()[config.r] + player.getAttributes()[config.t] + self.expBonus(player);
        	obj.r += player.getAttributes()[config.t] + self.expBonus(player);
        	obj.p += player.getAttributes()[config.r] + player.getAttributes()[config.c] + player.getAttributes()[config.i] + self.expBonus(player);
        });
        _.each(tmp.db, function(player) {
        	obj.pb += player.getAttributes()[config.r];
        	obj.r += player.getAttributes()[config.t];
        	obj.p += player.getAttributes()[config.r] + 2 * player.getAttributes()[config.c] + self.expBonus(player);
        });
		_.each(tmp.lb, function(player) {
			// todo: add in some check against config.getAction('lb') that returns 'blitz' / 'cover' / 'read'.
    		obj.pb += player.getAttributes()[config.t] + self.expBonus(player);
    		obj.r += player.getAttributes()[config.t] + self.expBonus(player);
        });
		_.each(tmp.nt, function(player) {
        	obj.pb += player.getAttributes()[config.r] + player.getAttributes()[config.t] + self.expBonus(player);
        	obj.rb += 2 * player.getAttributes()[config.t] + self.expBonus(player);
        });
 		_.each(tmp.dl, function(player) {
        	obj.rb += player.getAttributes()[config.t] + self.expBonus(player);
        	obj.pb += player.getAttributes()[config.t] + self.expBonus(player);
        });

	    _.each(obj.roster, function(player) {
            atts = player.getAttributes();
            obj.i += atts[config.i] + self.expBonus(player);
        });

        obj.tmp = tmp;

        return obj;
    }

    self.resolveDrive = function(config) {
        var oRPI = config.offenseRPI,
            dRPI = config.defenseRPI,
            oIBonus = oRPI.i > dRPI.i ? 10 : 4,
            dIBonus = oIBonus === 8 ? 4 : 10,
            position = 20,
            playResult = 0,
            down = 1,
            block = {},//rand.getRnd(10, 0) > 5 : {o: oRPI.rb, d: dRPI.rb}, {o: oRPI.pb, d: dRPI.pb},
            skills = {},//rand.getRnd(10, 0) > 5 : {o: oRPI.r, d: dRPI.r}, {o: oRPI.p, d: dRPI.p},
            tmp = 0,
            tmpO = {},
            possession = true,
            actTmp;

        while(possession) {
            actTmp = rand.getRnd(10,0) > 5 ? 'pass' : 'run';
            block = actTmp  !== 'pass' ? {o: oRPI.rb, d: dRPI.rb} : {o: oRPI.pb, d: dRPI.pb},
            skills = actTmp !== 'pass' ? {o: oRPI.r, d: dRPI.r} : {o: oRPI.p, d: dRPI.p},
            block.o = block.o + rand.getRnd(oIBonus, 0);
            block.d = block.d + rand.getRnd(dIBonus, 0);
            skills.o = skills.o + rand.getRnd(oIBonus, 0);
            skills.d = skills.d + rand.getRnd(dIBonus, 0);
            tmp = rand.getRnd(10,0);

            if(actTmp === 'pass') {
                actTmp = 'block';
                if(block.d - block.o > 4) {     // pass rush did well
                    if( tmp < 6 ) {
                        actTmp = 'sack';
                    } else if( tmp < 8) {
                        actTmp = 'dump';
                    } else {
                        actTmp = 'sneak';
                    }
                } else if(block.d - block.o > - 4 ){    // pass rush did so-so
                    if( tmp < 1 ) {
                        actTmp = 'sack';
                    } else if(tmp < 3) {
                        skills.o = skills.o - 8;
                        actTmp = 'dump';
                    } else if(tmp < 8) {
                        actTmp = 'pass';
                    } else {
                        skills.o = skills.o + 8;
                        actTmp = 'allDay';
                    }
                } else {    // pass rush did poorly
                    if( tmp < 0 ) {
                        actTmp = 'sack';
                    } else if(tmp < 1) {
                        skills.o = skills.o - 8;
                        actTmp = 'dump';
                    } else if(tmp < 6) {
                        actTmp = 'pass';
                    } else {
                        skills.o = skills.o + 8;
                        actTmp = 'allDay';
                    }
                }

                if(actTmp === 'sack') {
                    playResult = -rand.getRand(8,0);

                    tmp = rand.getRand(10,0);

                    if(tmp < 4) {
                        posse
                    }
                } else if( actTmp === 'sneak') {
                    playResult = rand.getRand(8,0);
                } else {
                    if(skills.d - skills.o > 8) {
                        tmpO.a = 3;
                        tmpO.b = 8;
                        tmpO.c = 10;
                        tmpO.d = 1000;
                    } else if( skills.d - skills.o > - 8) {
                        tmpO.a = 1;
                        tmpO.b = 4;
                        tmpO.c = 9;
                        tmpO.d = 11;
                    }  else {
                        tmpO.a = 0;
                        tmpO.b = 2;
                        tmpO.c = 7;
                        tmpO.d = 11;
                    }

                    if(tmp < tmpO.a) {
                        actTmp = 'interception';
                    } else if( tmp < tmpO.b) {
                        actTmp = 'incompletion';
                    } else if( tmp < tmpO.c) {
                        actTmp = 'completion';
                    } else if (tmp < tmpO.d) {
                        actTmp = 'bomb';
                    }

                    if(actTmp === 'interception') {
                        possession = false;
                    }
                    if(actTmp === 'completion') {
                        playResult = rand.getRand(20, -2);
                    }
                    if(actTmp === 'bomb') {
                        playResult = rand.getRand(60, 15);
                    }

                }

            }

            if(possession) {
                down = down + 1;


            }
        }

    }


    self.fillOutTeamGameObject = function(obj, config) {
        var atts;
        _.each(obj.roster, function(player) {
            atts = player.getAttributes();
            obj.r += atts[config.r] + self.expBonus(player);
            obj.p += atts[config.p] + self.expBonus(player);
            obj.i += atts[config.i] + self.expBonus(player);
        });

        return obj;
    }

    self.getScore = function (obj) {
    	var fn = self.getFootballScore;

    	if( (obj.bigRunSuccess || obj.bigPassSuccess) || (obj.smallRunSuccess && obj.smallPassSuccess)){
    		return fn('big');
		}

		if(  obj.rDiff < 0 && obj.pDiff < 0) {
			return fn('bad');
		}

		return fn('small');
    }

    self.getFootballScore = function (base) {
    	var outCome = {score: '', modifier: ''},
    		random = rand.getRnd(10, 0);

    	if( base === 'big') {
    		outCome.score = random > 3 ? 7 : 3;
    	}

    	if( base === 'small') {
    		outCome.score = random > 8 ? 7 : random > 3 ? 3 : 0;
    	}

    	if (base === 'bad') {
			outCome.score = random > 2 ? 0 : 0;
    	}

    	return outCome.score;
    }

    self.getBaseballScore = function (base) {
    	var outCome = {score: '', modifier: ''},
    		random = rand.getRnd(10, 0);

    	if( base === 'big') {
    		outCome.score = random > 8 ? rand.getRnd(3, 1) : rand.getRnd(1, 1);
    	}

    	if( base === 'small') {
    		outCome.score = random > 8 ? rand.getRnd(2, 0) : random > 3 ? rand.getRnd(1, 0) : 0;
    	}

    	if (base === 'bad') {
			outCome.score = random > 3 ? 0 : -1;
    	}

    	return outCome.score;
    }

    self.expBonus = function( player ){
    	var exp = player.getExperience(),
    		expQ = exp / 7 + 1;
    	return rand.getRnd(expQ, 0) + rand.getRnd(app.globalConfig.volatility, 0);
    }
};
