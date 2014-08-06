module("names.js standard");
module("player.js standard");
module("team.js standard");


test('COLLECTIONS: Teams - Construction', function() {
    ok(app.teams.length === 0, "construction worked.");
});

test('COLLECTIONS: Teams - Construction', function() {
    app.teams.add( new app.Team());
    ok(app.teams.length === 1, "construction worked.");
});

test('VIEWS: DG-APP-VIEW - Init', function() {
    var appView = new app.DgAppView();
    appView.initialize();
    ok(app.teams.length === 1, "construction worked.");
});


test('VIEWS: Team-View - Existence', function() {
    var appView = new app.DgAppView();
    appView.initialize();
    appView.addAll();
    //var view = new app.TeamView();
});


// test('VIEWS: Team-View - Render', function() {
//     var team = new app.Team();
//     team.init();
//     var view = new app.TeamView({ model: team });
//     var results = view.render();

//     ok( results.model.players.length > 0, "Non-zero players in model after render.");
// });


var assertIsBetween = function(low, high, actual){
    ok( actual >= low, "assert floor: " + actual);
    ok( actual <= high, "assert Ceiling: " + actual);
}