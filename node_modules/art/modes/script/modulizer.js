var AST = require('../../lib/ast-js/ast');

var artVar = new AST.Variable('ART'),
	moduleVar = new AST.Variable('module'),
	exportsProp = moduleVar.property('exports'),
	requireVar = new AST.Variable('require'),
	requireART = requireVar.call('art'),
	requireStatement = artVar.assign(requireART);

var Modulizer = {

	artVar: artVar,

	toExpression: function(){
		throw new Error('You need to implement toExpression on this class.');
	},

	_toModuleStatements: function(){
		var fn = new AST.Function(null, null, [ new AST.Return(this.toExpression()) ]);
		return [requireStatement, exportsProp.assign(fn)];
	},

	toModule: function(){
		return new AST.Block(
			// Make this overridable even when mixed in
			Modulizer._toModuleStatements.call(this)
		);
	}

};

module.exports = Modulizer;