var AST = require('./program');

AST.Call = function(expr, args){
	this.expression = AST.Expression(expr);
	var l = args ? args.length : 0;
	this.arguments = new Array(l);
	for (var i = 0; i < l; i++) this.arguments[i] = AST.Expression(args[i]);
};

AST.Call.prototype = new AST.Expression();

AST.Call.prototype.writeTo = function(write, format){
	this.expression.writeTo(write, format);
	write('(');
	var args = this.arguments;
	if (args.length > 0){
		args[0].writeTo(write, format);
		for (var i = 1, l = args.length; i < l; i++){
			write(', ');
			args[i].writeTo(write, format);
		}
	}
	write(')');
};

AST.New = function(){
	AST.Call.apply(this, arguments);
};

AST.New.prototype = new AST.Call();

AST.New.prototype.writeTo = function(write, format){
	write('new ');
	AST.Call.prototype.writeTo.call(this, write, format);
};

AST.Expression.prototype.call = function(){
	return new AST.Call(this, arguments);
};

AST.Expression.prototype.construct = function(){
	return new AST.New(this, arguments);
};
