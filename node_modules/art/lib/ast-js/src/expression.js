var AST = require('./program');

AST.Expression = function(obj){
	if (arguments.length == 0) return;
	if (obj && typeof obj.toExpression == 'function') obj = obj.toExpression();
	return obj instanceof AST.Expression ? obj : new AST.Literal(obj);
};

AST.Expression.prototype = new AST.Statement();
