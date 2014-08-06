function areEqual(a, b, msg){
	ok(a === b, msg + " |-> " + a + " equals " + b);
}

function ProbabilyObjectBuilder() {
};

ProbabilyObjectBuilder.prototype.getFootballObject = function() {
	return {
		first: {pass: 1, run: 1},
		pass: {shortPass: 1, longPass: 1},

		shortPass: {qbPressure: 4, qbScramble: 1, shortCompletion: 6, mediumCompletion: 2, longCompletion: 0, incompletion: 9, intercepted: 1},
		longPass: {qbPressure: 8, qbScramble: 2, shortCompletion: 2, mediumCompletion: 4, longCompletion: 8, incompletion: 16, intercepted: 2},
		badPass: {shortCompletion: 3, mediumCompletion: 2, longCompletion: 1, incompletion: 12, intercepted: 6},

		qbPressure: {sack: 8, qbScramble: 3, qbFumble: 3, badPass: 4, throwAway: 2},
		qbScramble: {sack: 3, shortGain: 4, mediumGain: 1, fumble: 1, runningPass: 7},
		runningPass: {shortCompletion: 4, mediumCompletion: 4, incompletion: 7, intercepted: 2},
		qbFumble: {bigLoss: 2, fumble: 2, defenseScore: 1},
		intercepted: {interception: 8, interceptionBigReturn: 3, fumble: 1, defenseScore: 1},
		throwAway: {intentionalGrounding: 1, incompletion: 10},

		shortCompletion: {shortGain: 10, mediumGain: 3, longGain: 1, fumble: 1, score: 1},
		mediumCompletion: {shortGain: 1, mediumGain: 10, longGain: 4, fumble: 1, score: 2},
		longCompletion: {shortGain: 0, mediumGain: 1, longGain: 10, fumble: 1, score: 5},


		run: {middleRun: 1, outsideRun: 1},
		
		middleRun: {shortLoss: 3, shortGain: 6, mediumGain: 2, longGain: 0, fumble: 1, score: 1},
		outsideRun: {shortLoss: 3, shortGain: 4, mediumGain: 3, longGain: 1, fumble: 1, score: 1},
		
		fumble: {shortLoss: 3, lostFumble: 3, shortGain: 1, defenseScore: 1}
	};
}

test('ENGINE: ProbabilityResolver - Existence', function() {
	var x = new ProbabilityResolver({});
});

test('ENGINE: ProbabilityResolver - Simple', function() {
	var x = new ProbabilityResolver(),
		result;

	result = x.resolve({
		first: {a: 1}
	});

	areEqual(result, "a", "should be a");
});

test('ENGINE: ProbabilityResolver - Two Values', function() {
	var x = new ProbabilityResolver(),
		probObj = {first: {a: 1, b: 1}},
		//expected = {a: true, b: true},
		actual = {a: 0, b: 0},
		result;

	for( var i = 0; i < 100; i++) {
		result = x.resolve(probObj);
		actual[result] += 1;
	}

	ok(actual.a > 0 && actual.b > 0, "Total: " + actual.a + " | " + actual.b);
});

test('ENGINE: ProbabilityResolver - Re-nesting-multiple-leaves', function() {
	var x = new ProbabilityResolver(),
		probObj,
		actual = {a: 0, b: 0, c:0},
		result;

	probObj = {
		first: {a: 1, b: 1},
		a: {b: 1, c: 1}
	};

	for( var i = 0; i < 100; i++) {
		result = x.resolve(probObj);
		actual[result] += 1;
	}

	// b and c are end-states.  a is transitional.
	ok(actual.a === 0 && actual.b > 0 && actual.c > 0, "Total: " + actual.a + " | " + actual.b + " | " + actual.c);
});

test('ENGINE: ProbabilityResolver - Re-nesting-one-leaf', function() {
	var x = new ProbabilityResolver(),
		probObj,
		actual = {a: 0, b: 0, c:0},
		result;

	probObj = {
		first: {a: 1, b: 1},
		a: {b: 1, c: 1},
		b: {c: 1}
	};

	for( var i = 0; i < 100; i++) {
		result = x.resolve(probObj);
		actual[result] += 1;
	}

	// b and c are end-states.  a is transitional.
	ok(actual.a === 0 && actual.b === 0 && actual.c > 0, "Total: " + actual.a + " | " + actual.b + " | " + actual.c);
});

test('ENGINE: ProbabilityResolver - ComplexObject', function() {
	var x = new ProbabilityResolver(),
		probObj,
		actual = {},
		result,
		tmp = "";

	probObj = new ProbabilyObjectBuilder().getFootballObject();

	for( var i = 0; i < 1000; i++) {
		result = x.resolve(probObj);

		if(actual[result]) {
			actual[result] += 1;
		} else {
			actual[result] = 1;
		}
	}

	_.each(_.keys(actual).sort(), function(itm) { tmp += itm + ": " + actual[itm] + " | "; });
	ok(true, tmp)
});

test('ENGINE: ProbabilityResolver - Complex - Modified Object', function() {
	var x = new ProbabilityResolver(),
		probObj,
		actual = {},
		result,
		tmp = "";

	probObj = new ProbabilyObjectBuilder().getFootballObject();;

	var elusiveQB,
		beastlyDE,
		precisionQB;

	elusiveQB = {
		sack: -4,
		qbScramble: 2,
		runningPass: 5,
		runningPass_ : {shortCompletion: 6, mediumCompletion: 6, incompletion: 1, intercepted: 1}
	};

	playmakerWR = {
		shortCompletion_: {shortGain: 10, mediumGain: 8, longGain: 4, fumble: 1, score: 2 },
		mediumCompletion_: {shortGain: 0, mediumGain: 12, longGain: 8, fumble: 1, score: 3},
	}

	beastlyDE = {
		qbPressure: 4,
		sack: 5,
		fumble: 2,
		shortLoss: 2
	}

	precisionQB = {
		qbPressure: -1,
		incompletion: -2,
		intercepted: -1,
		longGain: 1,
		shortGain: 3,
		mediumGain: 2
	}

	passingSituation = {
		pass: 4
	}

	//probObj = x.modify(probObj, passingSituation);
	//probObj = x.modify(probObj, elusiveQB);
	//probObj = x.modify(probObj, beastlyDE);
	//probObj = x.modify(probObj, precisionQB);
	probObj = x.modify(probObj, playmakerWR);

	for( var i = 0; i < 1000; i++) {
		result = x.resolve(probObj);

		if(actual[result]) {
			actual[result] += 1;
		} else {
			actual[result] = 1;
		}
	}

	_.each(_.keys(actual).sort(), function(itm) { tmp += itm + ": " + actual[itm] + " | "; });
	ok(true, tmp)
});

test('ENGINE: ProbabilityResolver - Probabily Modification - 2nd order', function() {
	var x = new ProbabilityResolver(),
		probObj,
		modObj,
		actual = {a: 0, b: 0, c:0},
		result,
		newObj;

	var getBaseProbObj = function() {
		return {
			first: {a: 10, b: 10},
			a: {b: 10, c: 10},
			b: {c: 10, d: 10}
		};
	};
	probObj = getBaseProbObj();

	modObj = {c: -10, d: 10};

	newObj = x.modify(probObj, modObj);

	ok(newObj.a.c === 0, "c is now 0");
	ok(newObj.b.c === 0, "c is now 0");
	ok(newObj.b.d === 20, "d is now 20");
});

test('ENGINE: ProbabilityResolver - Probabily Modification - 1st order', function() {
	var x = new ProbabilityResolver(),
		probObj,
		modObj,
		actual = {a: 0, b: 0, c:0},
		result,
		newObj;

	var getBaseProbObj = function() {
		return {
			first: {a: 10, b: 10},
			a: {b: 10, c: 10},
			b: {c: 10, d: 10}
		};
	};

	probObj = getBaseProbObj();
	modObj = {a_: {c: 1, d: 1}};

	newObj = x.modify(probObj, modObj);

	ok(newObj.a.c === 1, "c is now 1");
	ok(newObj.b.c === 10, "c is still 10");
	ok(newObj.a.d === 1, "d is now 1");
});