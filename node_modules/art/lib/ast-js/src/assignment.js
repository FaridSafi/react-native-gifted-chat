var AST = require('./program');

var err = 'Assignment is only possible on variables or properties.',
	posterr = 'Only the literal 1 is possible for post assignments.',
	assignableOps = /[\+\-\*\/\%]/;

AST.Assignment = function(left, right){
	if (!(left instanceof AST.Variable || left instanceof AST.Property)) throw new Error(err);
	this.left = left;
	this.right = AST.Expression(right);
};

AST.Assignment.prototype = new AST.Expression();

AST.Assignment.prototype.writeTo = function(writer, format){
	var left = this.left, right = this.right;

	left.writeTo(writer, format);

	if (right instanceof AST.Operator && right.left === left && assignableOps.test(right.operator)){
		if (right.right instanceof AST.Literal && right.right.value == 1){
			if (right.operator == '+'){
				writer('++');
				return;
			} else if (right.operator == '-'){
				writer('--');
				return;
			}
		}
		writer(' ' + right.operator + '= ');
		right = right.right;
	} else {
		writer(' = ');
	}
	right.writeTo(writer, format);
};

AST.PostAssignment = function(left, right, operator){
	if (!(left instanceof AST.Variable || left instanceof AST.Property)) throw new Error(err);
	this.left = left;
	this.operator = operator;
	this.right = AST.Expression(right);
	if (!(this.right instanceof AST.Operator) || this.right.left !== left || !(this.right.right instanceof AST.Literal) || this.right.right.value != 1) throw new Error(posterr);
}

AST.PostAssignment.prototype = new AST.Expression();

AST.PostAssignment.prototype.writeTo = function(writer, format){
	this.expression.writeTo(writer, format);
	writer(this.operator + this.operator);
};

AST.Expression.prototype.assignTo = function(expr){
	return new AST.Assignment(expr, this);
};

AST.Variable.prototype.assign = AST.Property.prototype.assign = function(expr){
	return new AST.Assignment(this, expr);
};

AST.Variable.prototype.increment = AST.Property.prototype.increment = function(){
	return new AST.Assignment(this, new AST.Add(this, 1));
};

AST.Variable.prototype.decrement = AST.Property.prototype.decrement = function(){
	return new AST.Assignment(this, new AST.Subtract(this, 1));
};

AST.Variable.prototype.postIncrement = AST.Property.prototype.postIncrement = function(){
	return new AST.PostAssignment(this, new AST.Add(this, 1));
};

AST.Variable.prototype.postDecrement = AST.Property.prototype.postDecrement = function(){
	return new AST.PostAssignment(this, new AST.Subtract(this, 1));
};