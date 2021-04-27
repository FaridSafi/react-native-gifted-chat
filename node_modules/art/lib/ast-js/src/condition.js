var AST = require('./program');

AST.Ternary = function(condition, then, els){
	this.condition = AST.Expression(condition);
	this.then = AST.Expression(then);
	this.els = AST.Expression(els);
};

AST.Ternary.prototype = new AST.Expression();

AST.Ternary.prototype.writeTo = function(write, format){
	this.condition.writeTo(write, format);
	write(' ? ');
	this.then.writeTo(write, format);
	write(' : ');
	this.els.writeTo(write, format);
};

AST.If = function(condition, then, els){
	this.condition = condition;
	this.then = then;
	this.els = els;
};

AST.If.prototype = new AST.Statement();

AST.If.prototype.writeTo = function(write, format){
	write('if (');
	this.condition.writeTo(write, format);
	write(')');
	this.then.writeTo(write, format);
	if (this.els){
		write(' else ');
		this.els.writeTo(write, format);
	}
};