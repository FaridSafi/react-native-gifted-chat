var AST = require('./program');

AST.Function = function(name, args, variables, statements){
	if (typeof name != 'string'){
		statements = variables;
		variables = args;
		args = name;
		name = null;
	}
	if (statements instanceof AST.Expression) statements = new AST.Return(statements);
	statements = AST.Block(statements);
	this.name = name;
	this.arguments = args;
	this.statements = statements;
	this.variables = variables;
};

AST.Function.prototype = new AST.Expression();

AST.Function.prototype.writeTo = function(write, format){
	write(this.name ? 'function ' + this.name + '(' : 'function(');
	if (this.arguments){
		for (var i = 0, l = this.arguments.length; i < l; i++){
			if (i > 0) write(', ');
			write(this.arguments[i].name);
		}
	}
	write('){\n');
	this.statements.writeTo(write, format);
	write('}');
};

AST.Function.prototype.compile = function(){
	var l = this.arguments.length,
		args = new Array(l + 1),
		body = [];

	for (var i = 0; i < l; i++) args[i] = this.arguments[i].name;

	this.statements.writeTo(function(str){ body.push(str); });
	args[l] = body.join('');

	return Function.apply(Function, args);
};
