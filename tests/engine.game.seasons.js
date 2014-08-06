module("names.js standard");
module("player.js standard");
module("team.js standard");


// test('ENGINE: Teams - Construction', function() {
//      app.TeamBuilder();
//      ok(app.teams.models.length > 0, "team builder is on");
// });

app.TeamBuilder();

test('ENGINE: Teams - Construction', function() {
    var s = new season(app.teams.getTeams());
    var x = s.getSeasonResult();
    ok(x, x.totalGamesPlayed);

    var i = 0,
    	prev = x.outcomes[0].wins + x.outcomes[0].losses,
    	curr, 
    	fail = false;
    for(i = 1; i < x.outcomes.length; i = i + 1){
    	curr = x.outcomes[i].wins + x.outcomes[i].losses;

    	if(prev !== curr){
    		fail = true;
    		break;
    	}

    	prev = curr;
    }

    ok(!fail, "Check that all teams played an equal number of games.");
});


test('ENGINE: Game - Scheduler', function() {
    var t = app.teams.getTeams();
    var s = new season(t);
    var x = s.getAllPairings(t);
    ok(x, 'Ok');
});


test('ENGINE: Game - History - Finish-Order', function() {
    var gameHistory = {},
        teams = [{Name: 'A'}, {Name: 'B'}, {Name: 'C'}, {Name: 'D'}];
    gameHistory.outcomes = [];

    gameHistory.outcomes.push({team: teams[0].Name, wins: 22, champion: false});
    gameHistory.outcomes.push({team: teams[1].Name, wins: 6, champion: false});
    gameHistory.outcomes.push({team: teams[2].Name, wins: 21, champion: true});
    gameHistory.outcomes.push({team: teams[3].Name, wins: 11, champion: false});

    app.seasonHistory.addSeason(gameHistory);

    var finishOrder = app.seasonHistory.getFinishOrder();

    ok(finishOrder[0] === 'C', "Champion is tops (C): " + finishOrder[0]);
    ok(finishOrder[1] === 'A', "Next in wins (A): " + finishOrder[1]);
    ok(finishOrder[2] === 'D', "Next in wins (D): " + finishOrder[2]);
    ok(finishOrder[3] === 'B', "Next in wins (B): " + finishOrder[3]);    

    app.seasonHistory.reset();
});



test('ENGINE: Game - History - All-Time-Wins', function() {
    var gameHistory = {},
        teams = [{Name: 'A'}, {Name: 'B'}];

    gameHistory.outcomes = [];
    gameHistory.outcomes.push({team: teams[0].Name, wins: 22, losses: 8, champion: true});
    gameHistory.outcomes.push({team: teams[1].Name, wins: 6, losses: 24, champion: false});
    app.seasonHistory.addSeason(gameHistory);
    // assert
    ok(app.seasonHistory.getAllTimeWL('A').w === 22);
    ok(app.seasonHistory.getAllTimeWL('A').l === 8);
    // end assert

    var gameHistory2 = {};
    gameHistory2.outcomes = [];
    gameHistory2.outcomes.push({team: teams[0].Name, wins: 20, losses: 10, champion: true});
    gameHistory2.outcomes.push({team: teams[1].Name, wins: 3, losses: 7, champion: false});
    app.seasonHistory.addSeason(gameHistory2);
    // assert
    ok(app.seasonHistory.getAllTimeWL('A').w === 42);
    ok(app.seasonHistory.getAllTimeWL('B').w === 9);
    // end assert

    app.seasonHistory.reset();

});