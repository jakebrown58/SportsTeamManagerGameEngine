module("names.js standard");
module("player.js standard");
module("team.js standard");


// test('ENGINE: Teams - Construction', function() {
//      app.TeamBuilder();
//      ok(app.teams.models.length > 0, "team builder is on");
// });

app.TeamBuilder();


var setup = function() {
    var teams = app.teams.getTeams();
    teams[0].signPlayer(app.players.models[0]);
    teams[1].signPlayer(app.players.models[1]);

    ok(teams[0].getPlayers().length === 1, "players ok");
    ok(teams[1].getPlayers().length === 1, "players ok");
};

var signX = function( num ) {
    var teams = app.teams.getTeams(),
        i = 0;

    app.globalConfig.playersPerTeam = num;

    for(i = 0; i < num; i++) {
        teams[0].signPlayer(app.players.models[i]);
    }   
    for(i = 0; i < num; i++) {
        teams[1].signPlayer(app.players.models[i+num]);
    }   

    ok(teams[0].getPlayers().length === num, "players ok");
    ok(teams[1].getPlayers().length === num, "players ok");
};

test('ENGINE: Game - Get Possession Score', function() {
    var s = app.teams.getTeams();
    x = new setup();


    g = new gamePlayer(s[0], s[1]);
    x = g.getPossessionScore(s[0], s[1], 0);

    window.console.log(x);
});

test('ENGINE: Game - SetPositions', function() {
    var s = app.teams.getTeams(),
        x = new signX(6),
        p,
        rpi,
        assertPos;

    g = new gamePlayer(s[0], s[1]);
    
    p = s[0].getPlayers();
    g.setPositions(p, {p:0, r:1, i:2, t:3});

    _.each(p, function(x) {
        x.atts = x.getAttributes();
        x.rScore = x.getAttributes()[1] + x.getAttributes()[3];
        x.pScore = x.getAttributes()[0] + x.getAttributes()[2];
    });

    _.each(p, function(x) {
        ok(x.oPos != null && x.dPos != null, "each player has a position assigned");
    });

    ok(g.getPlayerByPosition(p, 'qb').length === 1, "qb count is okay " + g.getPlayerByPosition(p, 'qb').length);
    ok(g.getPlayerByPosition(p, 'rb').length === 1, "rb count is okay " + g.getPlayerByPosition(p, 'rb').length);
    ok(g.getPlayerByPosition(p, 'wr').length === 2, "wr count is okay " + g.getPlayerByPosition(p, 'wr').length);
    ok(g.getPlayerByPosition(p, 'ol').length === (app.globalConfig.playersPerTeam - 4), "ol count is okay " + g.getPlayerByPosition(p, 'ol').length);

    ok(g.getPlayerByPosition(p, 'ss').length === 1, "ss count is okay " + g.getPlayerByPosition(p, 'ss').length);
    ok(g.getPlayerByPosition(p, 'db').length === 1, "db count is okay " + g.getPlayerByPosition(p, 'db').length);
    ok(g.getPlayerByPosition(p, 'lb').length === 2, "lb count is okay " + g.getPlayerByPosition(p, 'lb').length);
    ok(g.getPlayerByPosition(p, 'nt').length === 1, "nt count is okay " + g.getPlayerByPosition(p, 'nt').length);
    ok(g.getPlayerByPosition(p, 'dl').length === (app.globalConfig.playersPerTeam - 5), "dl count is okay " + g.getPlayerByPosition(p, 'dl').length);

    rpi = g.getOffenseRPI({roster: p}, {p:0, r:1, i:2, t:3});
    rpi = g.getDefenseRPI({roster: p}, {p:0, r:1, i:2, t:3});

    window.console.log("ok");
});

