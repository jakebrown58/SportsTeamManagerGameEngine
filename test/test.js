var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


var assert2 = require("../js/engine/ager.js")
describe('AgerLoad', function() {
	it('should load app when reuiqre is loaded', function() {
		var a = app;
		assert.notequal(a, null);
	})
});