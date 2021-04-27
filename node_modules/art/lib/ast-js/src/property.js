var AST = require('./program');

AST.Property = function(expr, name){
	this.expression = AST.Expression(expr);
	this.name = AST.Expression(name);
};

AST.Property.prototype = new AST.Expression();

AST.Property.prototype.writeTo = function(write, format){
	this.expression.writeTo(write, format);
	if (this.name instanceof AST.Literal && this.name.value){
		write('.');
		write(String(this.name.value));
		return;
	}
	write('[');
	this.name.writeTo(write, format);
	write(']');
};

AST.Expression.prototype.property = function(name){

	return new AST.Property(this, name);

};