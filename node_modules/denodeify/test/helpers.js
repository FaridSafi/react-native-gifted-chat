var assert = require('assert');
var denodeify = require('../');

function myNodeStyleFunction(argument1, argument2, callback) {
	if (argument1 && argument2) {
		callback(null, argument1+argument2);
	} else {
		callback('Need both arguments');
	}
}

exports.basicDenodeify = function() {
	it('should resolve when there are no errors', function(done) {
		var myDenodeifiedNodeStyleFunction = denodeify(myNodeStyleFunction);
		myDenodeifiedNodeStyleFunction(1, 2)
			.then(function(result) {
				assert.equal(3, result);
				done();
			}, function() {
				throw new Error('Error callback called wrongly');
			});
	});

	it('should reject when there are errors', function(done) {
		var myDenodeifiedNodeStyleFunction = denodeify(myNodeStyleFunction);
		var promise = myDenodeifiedNodeStyleFunction(1, undefined);
		assert(promise instanceof Promise);
		promise
			.then(function(result) {
				throw new Error('A Promised myNodeStyleFunction with one argument should never resolve');
			}, function(error) {
				assert.equal(error, 'Need both arguments');
				done();
			});
	});
};

function multipleArgumentsNodeStyleFunction(callback) {
	callback(null, 'a', 'b');
}

function myFilter(err, a, b) {
	return [err, [a, b]];
}

exports.multipleArguments = function() {
	it('should pass multiple arguments to the next then', function(done) {
		var myDenodeifiedNodeStyleFunction = denodeify(multipleArgumentsNodeStyleFunction, myFilter);
		myDenodeifiedNodeStyleFunction()
			.then(function(results) {
				assert.equal(results[0], 'a');
				assert.equal(results[1], 'b');
				done();
			});
	});
};
