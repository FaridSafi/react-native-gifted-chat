var AST = require('./program');

AST.Operator = function(left, operator, right){
	this.left = AST.Expression(left);
	this.operator = operator;
	this.right = AST.Expression(right);
};

AST.Operator.prototype = new AST.Expression();

AST.Operator.prototype.writeTo = function(write, format){
	this.left.writeTo(write, format);
	write(' ' + this.operator + ' ');
	this.right.writeTo(write, format);
};

AST.Not = function(expr){
	this.expression = expr;
};

AST.Not.prototype = new AST.Expression();

AST.Not.prototype.writeTo = function(write, format){
	write('!');
	this.expression.writeTo(write, format);
};

AST.Expression.prototype.not = function(){
	return new AST.Not(this);
};

var operators = {

	Equals: '==',
	NotEquals: '!=',
	StrictEquals: '===',
	StrictNotEquals: '!==',
	LessThan: '<',
	MoreThan: '>',
	LessThanOrEquals: '<=',
	MoreThanOrEquals: '>=',

	And: '&&',
	Or: '||',

	BitwiseAnd: '&',
	BitwiseOr: '|',
	BitwiseXor: '^',
	
	LeftShift: '<<',
	RightShift: '>>',
	ZeroFillRightShift: '>>>',

	Add: '+',
	Subtract: '-',
	Multiply: '*',
	Divide: '/',
	Mod: '%'

};

for (var key in operators) (function(name, cname, op){

	AST[name] = function(left, right){
		return new AST.Operator(left, op, right);
	};

	AST.Expression.prototype[cname] = function(expr){
		return new AST[name](this, expr);
	};

})(key, key.substr(0, 1).toLowerCase() + key.substr(1), operators[key]);
