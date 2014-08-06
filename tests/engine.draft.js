module("names.js standard");
module("player.js standard");
module("team.js standard");


// test('ENGINE: Teams - Construction', function() {
//      app.TeamBuilder();
//      ok(app.teams.models.length > 0, "team builder is on");
// });

app.TeamBuilder();

test('ENGINE: Draft Manager - Construction', function() {
    var s = app.draftManager;

    ok(app.draftManager, "Draft manager exists.");
});

test('ENGINE: Draft Manager - Round Robin', function() {
    var s = app.draftManager,
        me = this,
        teams = [{Name: 'C'}, {Name: 'B'}, {Name: 'A'}],
        freeAgents = [{Name: 'Bob'}],
        result,
        selectionFunction = function () {
            return freeAgents[0];
        };

    s.aiFindPlayer = selectionFunction;

    ok(s.aiFindPlayer().Name === 'Bob', "AI pick override working");

    s.startDraft(freeAgents, teams, null, 'snake');
    result = s.getNextChooser();
    ok(result.Name === 'C', "Has correct team name (C): " + result.Name);

    s.logPick(result, freeAgents[0]);
    result = s.getNextChooser();
    ok(result.Name === 'B', "Has correct team name (B): " + result.Name);
});

test('ENGINE: Draft Manager - Snake Draft - Successive picks', function() {
    var s = app.draftManager,
        teams = [{Name: 'C'}, {Name: 'B'}, {Name: 'A'}],
        freeAgents = [{Name: 'Bob'}];

    s.startDraft(freeAgents, teams, null, 'snake');

    s.draftState.round = 1;
    s.draftState.currentPick = 3;
    ok(s.getNextChooser().Name === 'A', "Has correct team name (A): " + s.getNextChooser().Name);
});

test('ENGINE: Draft Manager - Snake Draft - Round Wrapping', function() {
    var s = app.draftManager,
        teams = [{Name: 'C'}, {Name: 'B'}, {Name: 'A'}],
        freeAgents = [{Name: 'Bob'}];

    s.startDraft(freeAgents, teams, null, 'snake');
    s.draftState.round = 1;
    s.draftState.currentPick = 3;
    s.logPick(teams[2], freeAgents[0]);

    ok(s.getNextChooser().Name === 'A', "Has correct team name (A): " + s.getNextChooser().Name);
    ok(s.draftState.round === 2, "Has correct round");


    s.draftState.round = 2;
    s.draftState.currentPick = 3;
    ok(s.getNextChooser().Name === 'C', "Has correct team name (C): " + s.getNextChooser().Name);
});

test('ENGINE: Draft Manager - Snake Draft - Autorun', function() {
    var s = app.draftManager,
        teams = [{Name: 'A'}, {Name: 'B'}, {Name: 'C'}, {Name: 'D'}],
        freeAgents = [{Name: 'Bob'}];

    s.startDraft(freeAgents, teams, teams[1], 'snake');

    s.autoRun();
    ok(s.draftState.round === 1, "Ran to right round (1): " + s.draftState.round);
    ok(s.draftState.currentPick === 2, "Ran to right pick (2): " + s.draftState.currentPick);

    s.logPick(teams[1], freeAgents[0]);

    s.autoRun();
    ok(s.draftState.round === 2, "Ran to right round (2): " + s.draftState.round);
    ok(s.draftState.currentPick === 3, "Ran to right pick (3): " + s.draftState.currentPick);
});


test('ENGINE: Draft Manager - Rank Players', function() {
    var s = app.draftManager,
        players = [{Name: 'A', getPower: function(){return 4;}, getAge: function(){return 20;}},
            {Name: 'B', getPower: function(){return 6;}, getAge: function(){return 20;}}, 
            {Name: 'C', getPower: function(){return 7;}, getAge: function(){return 24;}}],
        freeAgents = [{Name: 'Free', getPower: function(){return 5;}, getAge: function(){return 20;}}],
        result;

    players[0].getPower();
    freeAgents[0].getPower();

    result = s.rankPlayers(players, freeAgents[0]);
    ok(result[0].Name === 'C', "Ranked players right (C): " + result[0].Name);
    ok(result[1].Name === 'B', "Ranked players right (B): " + result[1].Name);
    ok(result[2].Name === 'Free', "Ranked players right (Free): " + result[2].Name);
    ok(result[3].Name === 'A', "Ranked players right (A): " + result[3].Name);
});