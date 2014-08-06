module("names.js standard");
module("player.js standard");
module("team.js standard");


test('MODELS: Team - Construction', function() {
    var team = new app.Team();
    ok(team.attributes.name === "", "construction worked.");
});

