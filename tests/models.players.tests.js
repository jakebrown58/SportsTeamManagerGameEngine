
module("names.js standard");
module("player.js standard");
module("team.js standard");


test('COLLECTIONS: Player - Construction', function() {
    var value = app.players;
});

test('COLLECTIONS: Players - Add', function() {
    var player1 = new app.Player(),
        player2 = new app.Player(),
        mp1 = new app.BBPlayer(),
        mp2 = new app.BBPlayer();

    mp1.hydro(player1);
    mp2.hydro(player2);
    app.players.push(mp1);
    ok(app.players.length === 1, "ok");

    app.players.push(mp2);
    ok(app.players.length === 2, "ok");

    app.players.reset();
    ok( app.players.length === 0, "cleanup");
});

test('COLLECTIONS: Team - AddPlayer', function() {
    var test21 = new app.Player(),
        test33 = new app.Player(),
        mp1 = new app.BBPlayer(),
        mp2 = new app.BBPlayer();
        tAntelopes = new app.Team(),
        tZebras = new app.Team();

    mp1.hydro(test21);
    mp2.hydro(test33);
    app.players.push(mp1);
    app.players.push(mp2);

    tAntelopes.attributes.name = "Antelopes";
    tZebras.attributes.name = "Zebras";

    ok(tAntelopes.getPlayers().length === 0, "GetPlayers has should have 0");
    ok(tZebras.getPlayers().length === 0, "GetPlayers has should have 0");

    tAntelopes.signPlayer(mp1);
    ok(tAntelopes.getPlayers().length === 1, "GetPlayers has should have 1");
    ok(tZebras.getPlayers().length === 0, "GetPlayers has should have 0");

    tZebras.signPlayer(mp1);    
    ok(tAntelopes.getPlayers().length === 0, "GetPlayers has should have 0");
    ok(tZebras.getPlayers().length === 1, "GetPlayers has should have 1");

    app.players.reset();
    ok( app.players.length === 0, "cleanup");
});
